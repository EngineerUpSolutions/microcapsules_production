#!/bin/bash

SRC="/var/www/html/zajuna/local/microcapsulas/"
DEST="/home/sena/Documents/microcapsules/plugin/microcapsulas/"

echo "🔁 Syncing Moodle plugin code..."
rsync -av --delete "$SRC" "$DEST"
echo "✅ Sync complete!"
