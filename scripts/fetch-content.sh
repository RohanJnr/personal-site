#!/usr/bin/env bash
set -euo pipefail

# Copy Notes and Assets/Images from the cloned vault into the site project.
# Expects the vault to be checked out at ./obsidian-backup by the CI workflow.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Copying notes..."
rm -rf "$PROJECT_DIR/content/notes"
mkdir -p "$PROJECT_DIR/content/notes"
cp -r ./obsidian-backup/Notes/. "$PROJECT_DIR/content/notes/"

# content/rides/ is committed to the site repo, not touched here

echo "Copying images..."
rm -rf "$PROJECT_DIR/static/images"
mkdir -p "$PROJECT_DIR/static/images"
cp -r ./obsidian-backup/Assets/Images/. "$PROJECT_DIR/static/images/"

NOTE_COUNT=$(find "$PROJECT_DIR/content/notes" -name '*.md' | wc -l)
IMAGE_COUNT=$(find "$PROJECT_DIR/static/images" -type f | wc -l)
echo "Done: $NOTE_COUNT notes, $IMAGE_COUNT images"
