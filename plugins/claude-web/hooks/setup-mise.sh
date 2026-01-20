#!/usr/bin/env bash

set -euo pipefail

echo "Setting up mise..."

# Check if mise is installed
if ! command -v mise &> /dev/null; then
    echo "mise not found. Installing mise..."

    # Download and run the mise installer
    TMPFILE=$(mktemp)
    trap 'rm -f "$TMPFILE"' EXIT

    HTTP_STATUS=$(curl -fsSL https://mise.run -o "$TMPFILE" -w "%{http_code}")
    CURL_EXIT=$?

    if [ $CURL_EXIT -ne 0 ] || [ "$HTTP_STATUS" -ne 200 ]; then
        echo "Failed to download mise installer (HTTP: $HTTP_STATUS, curl exit: $CURL_EXIT)"
        exit 1
    fi

    bash "$TMPFILE"
    INSTALL_EXIT=$?

    if [ $INSTALL_EXIT -ne 0 ]; then
        echo "mise installation failed with exit code $INSTALL_EXIT"
        exit 1
    fi

    echo "mise installed successfully"

    # Add mise to PATH for the current session
    export PATH="$HOME/.local/bin:$PATH"
fi

# If in remote environment, trust and install
if [ -n "${CLAUDE_CODE_REMOTE:-}" ]; then
    echo "Remote environment detected. Running mise trust && mise install..."
    mise trust
    mise install
fi

echo "mise setup complete!"
