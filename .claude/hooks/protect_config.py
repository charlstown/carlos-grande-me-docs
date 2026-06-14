#!/usr/bin/env python3
"""PreToolUse hook (Write|Edit): guard configuration files.

Per CLAUDE.md section 3, changes to mkdocs.yml, dependency manifests and CI
workflows require explicit confirmation. This hook returns permissionDecision
"ask" so the user is prompted before the edit goes through (instead of a hard
block, which would also stop intentional edits).
"""
import json
import os
import sys

PROTECTED_NAMES = {"mkdocs.yml", "requirements.txt", "package.json", "package-lock.json"}


def is_protected(path: str) -> bool:
    norm = path.replace("\\", "/")
    if os.path.basename(norm) in PROTECTED_NAMES:
        return True
    if "/.github/" in norm or norm.startswith(".github/"):
        return True
    return False


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0

    file_path = (data.get("tool_input") or {}).get("file_path") or ""
    if not file_path or not is_protected(file_path):
        return 0

    reason = (
        f"`{os.path.basename(file_path)}` is a protected configuration file "
        "(CLAUDE.md §3). Confirm before modifying it."
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
