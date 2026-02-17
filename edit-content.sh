#!/usr/bin/env bash
set -euo pipefail

CONTENT_DIR="/Users/janjager/projects/Arianna-site/content"

if [ ! -d "$CONTENT_DIR" ]; then
  echo "Content directory not found: $CONTENT_DIR" >&2
  exit 1
fi

files=(
  "$CONTENT_DIR/index.json"
  "$CONTENT_DIR/industries.json"
  "$CONTENT_DIR/compliance.json"
  "$CONTENT_DIR/company.json"
  "$CONTENT_DIR/book-a-demo.json"
)

printf "\nChoose a file to edit:\n"
select file in "${files[@]}"; do
  if [ -n "$file" ]; then
    editor="${EDITOR:-nano}"
    echo "Opening: $file (editor: $editor)"
    "$editor" "$file"
    exit 0
  else
    echo "Invalid selection. Try again." >&2
  fi
done
