# KinDee Table QR Card Generator

A premium, responsive, single-page web application to customize, preview, and generate print-ready table QR code ordering cards for **KinDee Thai Hotpot**.

## Features

- **Live Customization**: Instantly update Table Number and destination QR Code URL.
- **Premium Branding**: Displays the KinDee logo in a rounded white card.
- **Thai Mandala Background**: Draws a beautiful, dark-orange Thai mandala vector motif directly behind the table number container.
- **A7 Landscape PDF Exports**: Renders a single-page landscape PDF conforming precisely to A7 size dimensions (`105mm × 74mm`) with no scaling, margins, or pagination issues.
- **Perfect Font Matching**:
  - Slogan: **Oswald (Semi-Bold)** (condensed sans-serif)
  - Table Label: **Oswald (Semi-Bold)**
  - Table Number: **Roboto Condensed (Heavy Black)** (incorporates correct flag/serif characteristics for vertical digits, e.g. "1")
- **Custom Logo Upload**: Option to upload alternative brand logos dynamically in the web panel.

## Technology Stack

- HTML5
- Tailwind CSS (Controls Dashboard Styling)
- Custom CSS (Preview Card & Typography Styling)
- QRCode.js (Dynamic QR rendering)
- html2canvas & jsPDF (High-DPI single-page PDF rendering)

## Setup & Running Locally

The project runs statically without complex build pipelines. 

To host the files locally:
```bash
npx http-server -p 8080 --cors
```
Open **http://localhost:8080** in your browser.
