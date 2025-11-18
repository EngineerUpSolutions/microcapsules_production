#!/bin/bash

echo "🔁 Syncing Moodle plugin code into Antiplagio repository..."
rsync -av --delete /var/www/html/zajuna/local/antiplagiarsena/ plugin/antiplagiarsena/
echo "✅ Sync complete!"
