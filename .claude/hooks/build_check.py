#!/usr/bin/env python3
"""Stop hook: run `mkdocs build --strict` when docs changed this session.

Only runs when there are uncommitted changes under docs/ or to mkdocs.yml, so
clean sessions close instantly. If the strict build fails, it blocks the stop
(exit 2) and feeds the error back to Claude to fix before finishing.
Respects stop_hook_active to avoid infinite loops.
"""
import json
import subprocess
import sys

try:
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0

    # Avoid re-entrancy: if we already blocked once, let the stop proceed.
    if data.get("stop_hook_active"):
        return 0

    try:
        status = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, timeout=15,
        ).stdout
    except Exception:
        return 0

    relevant = any(
        ("docs/" in line or line.strip().endswith("mkdocs.yml"))
        for line in status.splitlines()
    )
    if not relevant:
        return 0

    try:
        build = subprocess.run(
            [sys.executable, "-m", "mkdocs", "build", "--strict"],
            capture_output=True, text=True, timeout=180,
        )
    except FileNotFoundError:
        return 0
    except subprocess.TimeoutExpired:
        sys.stderr.write("mkdocs build --strict timed out after 180s.\n")
        return 0

    if build.returncode != 0:
        tail = (build.stderr or build.stdout or "").strip().splitlines()[-25:]
        sys.stderr.write(
            "`mkdocs build --strict` failed — fix before finishing:\n"
            + "\n".join(tail) + "\n"
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
