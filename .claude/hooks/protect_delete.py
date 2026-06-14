#!/usr/bin/env python3
"""PreToolUse hook (Bash): guard deletion of site content Markdown files.

Per CLAUDE.md section 3, deleting an existing content .md file requires explicit
confirmation. Detects rm / Remove-Item / del commands targeting a .md path under
docs/ and returns permissionDecision "ask". Deletions of .claude/ or specs/
scaffolding are not content and are left alone.
"""
import json
import re
import sys

# Deletion verbs followed (anywhere) by a token ending in .md
DELETE_RE = re.compile(r"\b(rm|del|erase|Remove-Item|ri)\b", re.IGNORECASE)
# A token that points at a content Markdown file under docs/
MD_RE = re.compile(r"\bdocs[\\/]\S*\.md\b", re.IGNORECASE)


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0

    command = (data.get("tool_input") or {}).get("command") or ""
    if not command:
        return 0

    if DELETE_RE.search(command) and MD_RE.search(command):
        reason = (
            "This command appears to delete a Markdown (.md) file. "
            "Deleting existing .md files requires explicit confirmation (CLAUDE.md §3)."
        )
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "ask",
                "permissionDecisionReason": reason,
            }
        }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
