#!/usr/bin/env python3
"""Stamp the deploy date into the footer of every language version.

Runs as the Netlify build command. The repo keeps whatever date was last
committed, so if this script ever fails to run the footer still shows a real
(if stale) date rather than a broken placeholder.
"""
import datetime
import pathlib
import re
import sys

FILES = ["index.html", "en/index.html", "fr/index.html"]
PATTERN = re.compile(
    r'(<time id="lastUpdated" datetime=")\d{4}-\d{2}-\d{2}(">)\d{4}-\d{2}-\d{2}(</time>)'
)

today = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
stamped = 0

for name in FILES:
    path = pathlib.Path(name)
    if not path.exists():
        print(f"stamp-date: {name} not found, skipping", file=sys.stderr)
        continue
    text = path.read_text(encoding="utf-8")
    new_text, count = PATTERN.subn(rf"\g<1>{today}\g<2>{today}\g<3>", text)
    if count:
        path.write_text(new_text, encoding="utf-8")
        stamped += count
    else:
        print(f"stamp-date: no <time id=\"lastUpdated\"> in {name}", file=sys.stderr)

print(f"stamp-date: stamped {today} into {stamped} file(s)")
