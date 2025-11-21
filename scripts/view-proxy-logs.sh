#!/bin/bash

# Script to view the proxy logs in syslog format
LOG_FILE="/opt/mediahubws/logs/mediahubws-admin/proxy.log"

echo "=== Proxy MediaHub Logs (Syslog Format) ==="
echo "File: $LOG_FILE"
echo "=========================================="

if [ ! -f "$LOG_FILE" ]; then
    echo "❌ Log file not found: $LOG_FILE"
    exit 1
fi

# Function to display the logs with coloring
show_logs() {
    case "$1" in
        "tail")
            echo "📊 Real-time tracking of logs (Ctrl+C to stop):"
            tail -f "$LOG_FILE" | while read line; do
                # Extract the syslog priority level
                if [[ $line =~ ^\<([0-9]+)\> ]]; then
                    priority=${BASH_REMATCH[1]}
                    severity=$((priority % 8))
                    
                    case $severity in
                        0|1|2|3) echo -e "\033[31m$line\033[0m" ;;  # Red for errors
                        4) echo -e "\033[33m$line\033[0m" ;;        # Yellow for warnings
                        6) echo -e "\033[32m$line\033[0m" ;;        # Green for info
                        *) echo "$line" ;;                          # Normal for others
                    esac
                else
                    echo "$line"
                fi
            done
            ;;
        "errors")
            echo "🔴 Only error logs:"
            grep -E "<(128|129|130|131)>" "$LOG_FILE" | tail -20
            ;;
        "warnings")
            echo "🟡 Only warning logs:"
            grep -E "<(132|133|134|135)>" "$LOG_FILE" | tail -20
            ;;
        "info")
            echo "ℹ️ Only info logs:"
            grep -E "<(134|135)>" "$LOG_FILE" | tail -20
            ;;
        "last")
            echo "📋 Last 20 entries:"
            tail -20 "$LOG_FILE"
            ;;
        "stats")
            echo "📊 Log statistics:"
            echo "Total entries: $(wc -l < "$LOG_FILE")"
            echo "Errors (0-3): $(grep -cE "<(128|129|130|131)>" "$LOG_FILE" 2>/dev/null || echo 0)"
            echo "Warnings (4): $(grep -cE "<(132|133|134|135)>" "$LOG_FILE" 2>/dev/null || echo 0)"
            echo "Info (6): $(grep -cE "<(134|135)>" "$LOG_FILE" 2>/dev/null || echo 0)"
            echo "File size: $(du -h "$LOG_FILE" | cut -f1)"
            ;;
        *)
            echo "Usage: $0 [tail|errors|warnings|info|last|stats]"
            echo ""
            echo "Options:"
            echo "  tail     - Real-time tracking"
            echo "  errors   - Display only errors"
            echo "  warnings - Display only warnings"
            echo "  info     - Display only info"
            echo "  last     - Display the last 20 entries"
            echo "  stats    - Display the statistics"
            echo ""
            echo "📋 Last 10 entries by default:"
            tail -10 "$LOG_FILE"
            ;;
    esac
}

show_logs "$1"
