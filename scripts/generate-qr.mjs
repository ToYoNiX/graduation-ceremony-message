// Generate a QR code PNG (and SVG) pointing at your deployed site.
//
// Usage:
//   npm run qr -- https://<your-user>.github.io/graduation-ceremony-message/
//
// If you omit the URL it falls back to the SITE_URL env var.
// Output goes to ./qr/ (qr.png + qr.svg) — big and print-friendly for a slide.

import QRCode from 'qrcode'
import { mkdir, writeFile } from 'node:fs/promises'

const url = process.argv[2] || process.env.SITE_URL

if (!url) {
  console.error(
    'Please pass your deployed URL:\n' +
      '  npm run qr -- https://<your-user>.github.io/graduation-ceremony-message/',
  )
  process.exit(1)
}

await mkdir('qr', { recursive: true })

const opts = {
  errorCorrectionLevel: 'M',
  margin: 2,
  width: 1200,
  color: { dark: '#0f172a', light: '#ffffff' },
}

await QRCode.toFile('qr/qr.png', url, opts)
await writeFile('qr/qr.svg', await QRCode.toString(url, { ...opts, type: 'svg' }))

console.log(`✅ QR code generated for: ${url}`)
console.log('   → qr/qr.png (drop this into your ceremony slide)')
console.log('   → qr/qr.svg (vector, scales to any size)')
