#!/usr/bin/env bash
# Usage: edit REMOTE_URL below or pass as first arg
REMOTE_URL=${1:-""}
if [ -z "$REMOTE_URL" ]; then
  echo "Set REMOTE_URL as the first argument or edit this script"
  exit 1
fi

cd "$(dirname "$0")"

git init
git add -A
git commit -m "chore: initial commit - migrate from local workspace" || echo "No changes to commit"

git remote add origin "$REMOTE_URL" || echo "Remote already exists"

git branch -M main

git push -u origin main

echo "Done"
