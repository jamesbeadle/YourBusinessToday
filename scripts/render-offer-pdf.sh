#!/usr/bin/env bash
# Renders docs/offer/client-offer.html to the PDF the offer page links to.
# Needs a Chromium binary: pass its path as CHROMIUM, or let the script find one.
set -euo pipefail

repository_root="$(cd "$(dirname "$0")/.." && pwd)"
source_page="$repository_root/docs/offer/client-offer.html"
output_pdf="$repository_root/static/documents/your-business-today-offer.pdf"

chromium="${CHROMIUM:-$(command -v chromium || command -v chromium-browser || command -v google-chrome || echo /opt/pw-browsers/chromium-1194/chrome-linux/chrome)}"

mkdir -p "$(dirname "$output_pdf")"
"$chromium" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
	--virtual-time-budget=8000 --print-to-pdf="$output_pdf" "file://$source_page"

echo "Wrote $output_pdf"
