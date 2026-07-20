document.addEventListener('DOMContentLoaded', () => {
  const tableNumberInput = document.getElementById('tableNumberInput');
  const qrLinkInput      = document.getElementById('qrLinkInput');
  const previewScale     = document.getElementById('previewScale');
  const scaleValue       = document.getElementById('scaleValue');
  const tableCard        = document.getElementById('tableCard');
  const cardTableNumber  = document.getElementById('cardTableNumber');
  const logoUpload       = document.getElementById('logoUpload');
  const logoPreview      = document.getElementById('logoPreview');
  const cardLogo         = document.getElementById('cardLogo');
  const downloadPdfBtn   = document.getElementById('downloadPdfBtn');
  const qrcodeContainer  = document.getElementById('qrcode');

  // ── QR Code Init ─────────────────────────────────────────────────────────
  let qrCode = new QRCode(qrcodeContainer, {
    text: qrLinkInput.value.trim(),
    width: 380,
    height: 380,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });

  // ── Initial Scale ─────────────────────────────────────────────────────────
  applyScale(previewScale.value);

  // ── Event Listeners ───────────────────────────────────────────────────────

  tableNumberInput.addEventListener('input', () => {
    cardTableNumber.textContent = tableNumberInput.value.trim() || '??';
  });

  qrLinkInput.addEventListener('input', () => {
    const url = qrLinkInput.value.trim();
    if (url) { qrCode.clear(); qrCode.makeCode(url); }
  });

  previewScale.addEventListener('input', e => applyScale(e.target.value));

  function applyScale(val) {
    const pct = Math.round(val * 100);
    scaleValue.textContent = `${pct}%`;
    tableCard.style.transform = `scale(${val})`;
  }

  logoUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      logoPreview.src = ev.target.result;
      cardLogo.src    = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // ── Download A7 PDF ───────────────────────────────────────────────────────
  // Strategy: capture card as a high-res image with html2canvas,
  // then insert it on a SINGLE A7 landscape page with jsPDF.
  // This completely avoids pagination.

  downloadPdfBtn.addEventListener('click', async () => {
    const tableNum = tableNumberInput.value.trim() || 'Table';
    const btn = downloadPdfBtn;

    // Show loading state
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-lg"></i> Generating...';

    try {
      // 1. Reset transform so html2canvas captures the full card at 1:1
      const prevTransform = tableCard.style.transform;
      tableCard.style.transform = 'scale(1)';
      tableCard.style.borderRadius = '0';
      tableCard.style.boxShadow = 'none';

      // 2. Wait a frame for styles to apply
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      // 3. Capture with html2canvas at 3× resolution for crispness
      const canvas = await html2canvas(tableCard, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        onclone: (doc) => {
          // Ensure cloned element also has no transform/radius/shadow
          const el = doc.getElementById('tableCard');
          if (el) {
            el.style.transform = 'scale(1)';
            el.style.borderRadius = '0';
            el.style.boxShadow = 'none';
          }
        }
      });

      // 4. Restore preview styling
      tableCard.style.transform  = prevTransform;
      tableCard.style.borderRadius = '';
      tableCard.style.boxShadow  = '';

      // 5. Create jsPDF at A7 landscape (105 × 74 mm)
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [105, 74]   // A7 landscape
      });

      const pageW = 105;
      const pageH = 74;

      // 6. Fit the canvas image into the page (cover entire page, no white margins)
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH, '', 'FAST');

      // 7. Save
      pdf.save(`KinDee_Table_${tableNum}.pdf`);

    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-file-pdf text-lg"></i> Download A7 PDF';
    }
  });
});
