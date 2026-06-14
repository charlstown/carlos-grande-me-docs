#!/usr/bin/env python3
"""SessionStart hook: remind agents of the branching model.

Injects the feature -> dev -> main flow into the session context so no command
or agent opens a PR directly into main (which the enforce-pr-source workflow
rejects).
"""
import json
import sys

CONTEXT = (
    "Branching model for this repo: feature/* -> dev -> main. "
    "Branch from `dev`. Open PRs into `dev` (preview deploy to GitHub Pages). "
    "`dev` is promoted to `main` (production deploy to S3) via a separate PR. "
    "PRs into `main` are accepted ONLY from `dev` or `hotfix/*` — never from a "
    "feature branch directly. Posts are written in English (CLAUDE.md §4)."
)


def main() -> int:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": CONTEXT,
        }
    }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
