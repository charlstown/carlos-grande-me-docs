"""Normalize page metadata used by the site's SEO template.

The hook intentionally only prepares data.  Rendering meta tags and JSON-LD is
kept in the Material override so that MkDocs' normal metadata pipeline remains
the single source of truth.
"""

from __future__ import annotations

import re
from datetime import date, datetime
from typing import Any, Mapping
from urllib.parse import urljoin


# More specific prefixes must precede their parent paths.
CONTENT_SCHEMA_TYPES = {
    "notebooks/": "TechArticle",
    "resources/": "TechArticle",
    "references/": "Article",
    "projects/": "BlogPosting",
}

_WHITESPACE_RE = re.compile(r"\s+")
_FRONTMATTER_RE = re.compile(r"\A---\s*\n.*?\n---\s*\n", re.DOTALL)


def _config_value(config: Any, name: str, default: Any = "") -> Any:
    """Read a MkDocs config field from either a mapping or Config object."""
    if isinstance(config, Mapping):
        return config.get(name, default)
    return getattr(config, name, default)


def _clean_text(value: Any) -> str:
    """Return a compact string, treating old ``description: none`` as empty."""
    if value is None:
        return ""
    text = _WHITESPACE_RE.sub(" ", str(value)).strip()
    return "" if text.lower() in {"", "none", "null"} else text


def _absolute_url(value: Any, site_url: str) -> str:
    value = _clean_text(value)
    if not value:
        return ""
    return urljoin(site_url.rstrip("/") + "/", value)


def _normalise_date(value: Any) -> str:
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    return _clean_text(value)


def _page_path(page: Any) -> str:
    file = getattr(page, "file", None)
    path = (
        getattr(file, "src_uri", None)
        or getattr(file, "src_path", None)
        or getattr(page, "url", "")
    )
    return _clean_text(path).replace("\\", "/").lstrip("/")


def _is_indexable_markdown(page: Any) -> bool:
    file = getattr(page, "file", None)
    source = _page_path(page).lower()
    if not page or not file or not source.endswith(".md"):
        return False

    meta = getattr(page, "meta", None) or {}
    robots = _clean_text(meta.get("robots", "")).lower()
    if "noindex" in robots or meta.get("search") is False:
        return False
    return True


def resolve_page_description(page: Any) -> str:
    """Resolve a usable description from front matter, then Markdown content."""
    meta = getattr(page, "meta", None) or {}
    description = _clean_text(meta.get("description"))
    if description:
        return description

    markdown = getattr(page, "markdown", "") or ""
    markdown = _FRONTMATTER_RE.sub("", markdown)
    # Drop headings, links/images and simple Markdown punctuation before using
    # the first prose paragraph as a conservative fallback.
    for paragraph in re.split(r"\n\s*\n", markdown):
        text = paragraph.strip()
        if not text or text.startswith(("#", "```", "!!!", "- ", "* ")):
            continue
        text = re.sub(r"!?(?:\[([^\]]*)\]\([^)]*\))", r"\1", text)
        text = re.sub(r"[`*_>#]", "", text)
        text = _clean_text(text)
        if text:
            return text[:160].rstrip(" ,;:-")
    return ""


def build_site_schema(config: Any) -> dict[str, str]:
    """Build the WebSite JSON-LD entity shared by every indexable page."""
    site_url = _absolute_url(_config_value(config, "site_url"), "")
    schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": _clean_text(_config_value(config, "site_name")),
        "url": site_url,
    }
    description = _clean_text(_config_value(config, "site_description"))
    author = _clean_text(_config_value(config, "site_author"))
    if description:
        schema["description"] = description
    if author:
        schema["publisher"] = {"@type": "Person", "name": author}
    return {key: value for key, value in schema.items() if value}


def build_page_schema(page: Any, config: Any, seo: Mapping[str, Any]) -> dict[str, Any]:
    """Build the JSON-LD content entity for an individual Markdown page."""
    path = _page_path(page)
    schema_type = next(
        (value for prefix, value in CONTENT_SCHEMA_TYPES.items() if path.startswith(prefix)),
        "BlogPosting",
    )
    schema: dict[str, Any] = {
        "@context": "https://schema.org",
        "@type": schema_type,
        "headline": seo["title"],
        "description": seo["description"],
        "url": seo["url"],
        "mainEntityOfPage": {"@type": "WebPage", "@id": seo["url"]},
    }
    if seo.get("datePublished"):
        schema["datePublished"] = seo["datePublished"]
    if seo.get("dateModified"):
        schema["dateModified"] = seo["dateModified"]
    if seo.get("image"):
        schema["image"] = seo["image"]
    if seo.get("thumbnail"):
        schema["thumbnailUrl"] = seo["thumbnail"]
    author = _clean_text(_config_value(config, "site_author"))
    if author:
        schema["author"] = {"@type": "Person", "name": author}
    return {key: value for key, value in schema.items() if value}


def on_page_context(context: dict[str, Any], page: Any, config: Any, nav: Any) -> dict[str, Any]:
    """Expose normalized SEO metadata to Material templates for indexable pages."""
    if not _is_indexable_markdown(page):
        return context

    meta = getattr(page, "meta", None) or {}
    site_url = _absolute_url(_config_value(config, "site_url"), "")
    page_url = _absolute_url(getattr(page, "canonical_url", None) or getattr(page, "url", ""), site_url)
    thumbnail = _absolute_url(meta.get("thumbnail"), site_url)
    image = _absolute_url(meta.get("image") or thumbnail, site_url)
    title = _clean_text(getattr(page, "title", None) or meta.get("title") or _config_value(config, "site_name"))

    seo: dict[str, Any] = {
        "title": title,
        "description": resolve_page_description(page),
        "datePublished": _normalise_date(meta.get("date")),
        "dateModified": _normalise_date(meta.get("updated") or meta.get("date_modified")),
        "image": image,
        "url": page_url,
        "thumbnail": thumbnail,
    }
    seo["site_schema"] = build_site_schema(config)
    seo["page_schema"] = build_page_schema(page, config, seo)
    context["seo"] = seo
    return context
