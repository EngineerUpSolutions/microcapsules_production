#!/bin/bash

SRC="/var/www/html/zajuna/local/microcapsulas/"
DEST="/home/ubuntu/microcapsulas/plugin/microcapsulas/"

echo "🔁 Syncing Moodle plugin code..."
rsync -av --delete "$SRC" "$DEST"
echo "✅ Sync complete!"
