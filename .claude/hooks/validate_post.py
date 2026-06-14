#!/usr/bin/env python3
"""PostToolUse hook (Write|Edit): validate MkDocs post conventions.

Non-blocking: the tool has already run. On problems it prints a consolidated
reminder to stderr and exits 2 so Claude sees it and can fix it in place.
Validates the rules in CLAUDE.md sections 5.1 and 5.2.
"""
import json
import os
import re
import sys

try:  # ensure non-ASCII reminders render correctly on Windows consoles
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

# Files under docs/ that are not posts and must be skipped.
SKIP_NAMES = {"index.md", "about-me.md"}
# Sections allowed to be unnumbered (written by the research agent).
UNNUMBERED_OK = {"references", "further reading"}


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0

    tool_input = data.get("tool_input") or {}
    file_path = tool_input.get("file_path") or ""
    if not file_path:
        return 0

    norm = file_path.replace("\\", "/")
    if not norm.endswith(".md"):
        return 0
    if "/docs/" not in norm and not norm.startswith("docs/"):
        return 0
    if os.path.basename(norm) in SKIP_NAMES:
        return 0

    try:
        with open(file_path, encoding="utf-8") as f:
            text = f.read()
    except OSError:
        return 0

    problems = []

    # --- Frontmatter ---
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", text, re.DOTALL)
    if not fm_match:
        problems.append("Missing YAML frontmatter block (--- ... ---) at the top.")
        body = text
        fm = ""
    else:
        fm, body = fm_match.group(1), fm_match.group(2)

        def field(name):
            m = re.search(rf"^{name}:\s*(.*)$", fm, re.MULTILINE)
            return m.group(1).strip() if m else None

        short_title = field("short_title")
        description = field("description")
        date = field("date")
        thumbnail = field("thumbnail")

        if short_title is None:
            problems.append("Frontmatter missing `short_title`.")
        if description is None:
            problems.append("Frontmatter missing `description`.")
        if date is None:
            problems.append("Frontmatter missing `date`.")
        elif not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
            problems.append(f"Frontmatter `date` must be YYYY-MM-DD (got: {date!r}).")
        if thumbnail is None:
            problems.append("Frontmatter missing `thumbnail`.")

    # --- Body structure ---
    h1s = re.findall(r"^# .+$", body, re.MULTILINE)
    if len(h1s) == 0:
        problems.append("Body has no `# H1` title.")
    elif len(h1s) > 1:
        problems.append(f"Body has {len(h1s)} `# H1` headings; there must be exactly one.")

    # Detect a "finished" post (has at least one ## section) to decide whether
    # placeholder frontmatter is worth flagging — avoids noise on fresh scaffolds.
    h2s = re.findall(r"^## (.+)$", body, re.MULTILINE)
    finished = len(h2s) > 0

    if finished and fm:
        if (description := field("description") if fm else None) in (None, "none", ""):
            problems.append("Frontmatter `description` is still `none` — write a real one sentence summary.")
        for h2 in h2s:
            title = h2.strip().lower()
            if title in UNNUMBERED_OK:
                continue
            if not re.match(r"^\d+\.", h2.strip()):
                problems.append(f"Section `## {h2.strip()}` is not numbered (use `## 1.`, `## 2.`, …).")
                break  # one example is enough

    if not problems:
        return 0

    sys.stderr.write(
        "Post convention reminders for "
        + os.path.basename(file_path)
        + " (CLAUDE.md §5):\n- "
        + "\n- ".join(problems)
        + "\n"
    )
    return 2


if __name__ == "__main__":
    sys.exit(main())
