#!/bin/bash

# Script to rotate the proxy logs
LOG_DIR="/opt/mediahubws/logs/mediahubws-admin"
LOG_FILE="$LOG_DIR/proxy.log"
MAX_SIZE="10M"  # Maximum size before rotation
KEEP_LOGS=5     # Number of log files to keep

echo "=== Rotation of Proxy MediaHub Logs ==="

# Check if the log file exists
if [ ! -f "$LOG_FILE" ]; then
    echo "❌ Log file not found: $LOG_FILE"
    exit 1
fi

# Get the file size in bytes
file_size=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null)
max_size_bytes=$(echo "$MAX_SIZE" | sed 's/M/*1024*1024/' | sed 's/K/*1024/' | bc 2>/dev/null || echo 10485760)

echo "📊 Current size: $(du -h "$LOG_FILE" | cut -f1)"
echo "📏 Maximum size: $MAX_SIZE"

# Check if the rotation is necessary
if [ "$file_size" -gt "$max_size_bytes" ]; then
    echo "🔄 Rotation necessary..."
    
    # Create a timestamp for the archived file
    timestamp=$(date +"%Y%m%d_%H%M%S")
    
    # Move the old files
    for i in $(seq $((KEEP_LOGS-1)) -1 1); do
        if [ -f "$LOG_FILE.$i.gz" ]; then
            mv "$LOG_FILE.$i.gz" "$LOG_FILE.$((i+1)).gz"
            echo "📦 Moved: proxy.log.$i.gz → proxy.log.$((i+1)).gz"
        fi
    done
    
    # Compress and archive the current file
    gzip -c "$LOG_FILE" > "$LOG_FILE.1.gz"
    echo "📦 Archived: proxy.log → proxy.log.1.gz"
    
    # Empty the current file (do not delete it to avoid problems with the current processes)
    > "$LOG_FILE"
    echo "🧹 Log file emptied"
    
    # Delete the old files if necessary
    if [ -f "$LOG_FILE.$((KEEP_LOGS+1)).gz" ]; then
        rm "$LOG_FILE.$((KEEP_LOGS+1)).gz"
        echo "🗑️ Deleted: proxy.log.$((KEEP_LOGS+1)).gz"
    fi
    
    echo "✅ Rotation terminée"
else
    echo "ℹ️ No rotation necessary"
fi

# Display the final state
echo ""
echo "📋 Current log files:"
ls -lh "$LOG_DIR"/proxy.log* 2>/dev/null || echo "Only the main file exists"
