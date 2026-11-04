/**
 * Builds public/og-image.png (1200 × 630) — the social sharing card — from the
 * site's own branding: the W waveform mark, the colour tokens and the real
 * profile photo. Run with `npm run og` after changing the name or role.
 */
import sharp from 'sharp';

const W = 1200;
const H = 630;
const PHOTO = 'public/assets/legacy/profile/profile.png';
const OUT = 'public/og-image.png';

const name = ['Satetapong', 'Sanguansuk'];
const role = 'Computer Engineering Student & Developer';
const school = 'Sripatum University · Bangkok';
const tagline = 'Building ideas into digital experiences.';
const url = 'satetapong-portfolio.vercel.app';

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const MONO = "Consolas, 'Courier New', monospace";

// Faint grid and scanlines, like the site background.
const grid = Array.from({ length: 30 }, (_, i) => `<line x1="${i * 48}" y1="0" x2="${i * 48}" y2="${H}" />`).join('') +
  Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 48}" x2="${W}" y2="${i * 48}" />`).join('');

const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="g1" cx="0.18" cy="0.2" r="0.6">
      <stop offset="0" stop-color="#00D9FF" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#00D9FF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.85" cy="0.9" r="0.6">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="signal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#00D9FF"/>
      <stop offset="0.5" stop-color="#387BFF"/>
      <stop offset="1" stop-color="#8B5CF6"/>
    </linearGradient>
    <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="#000" opacity="0.18"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#080A0F"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>
  <g stroke="#8B96A8" stroke-opacity="0.07" stroke-width="1">${grid}</g>
  <rect width="${W}" height="${H}" fill="url(#scan)"/>

  <!-- corner brackets -->
  <g stroke="#00D9FF" stroke-opacity="0.55" stroke-width="2" fill="none">
    <path d="M40 72 V40 H72"/><path d="M${W - 72} 40 H${W - 40} V72"/>
    <path d="M40 ${H - 72} V${H - 40} H72"/><path d="M${W - 72} ${H - 40} H${W - 40} V${H - 72}"/>
  </g>

  <!-- brand -->
  <g transform="translate(80 86)">
    <rect width="56" height="56" rx="14" fill="#10141C" stroke="#8B96A8" stroke-opacity="0.25"/>
    <path transform="translate(8 8) scale(1.25)" d="M5 9.5 L10 23 L14 14 L16 18.5 L18 14 L22 23 L27 9.5" fill="none" stroke="url(#signal)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="76" y="37" font-family="${MONO}" font-size="22" letter-spacing="7" fill="#F4F7FB">WAVE</text>
  </g>

  <text x="80" y="214" font-family="${MONO}" font-size="19" letter-spacing="3" fill="#00D9FF">// PORTFOLIO · CASE STUDIES · LAB</text>

  <text font-family="${FONT}" font-weight="700" font-size="76" fill="#F4F7FB" letter-spacing="-1.5">
    <tspan x="76" y="300">${name[0]}</tspan>
    <tspan x="76" y="382">${name[1]}</tspan>
  </text>

  <rect x="80" y="412" width="96" height="4" rx="2" fill="url(#signal)"/>
  <text x="80" y="460" font-family="${FONT}" font-size="30" font-weight="600" fill="#F4F7FB">${role.replace('&', '&amp;')}</text>
  <text x="80" y="500" font-family="${FONT}" font-size="24" fill="#8B96A8">${school}</text>
  <text x="80" y="566" font-family="${MONO}" font-size="20" fill="#6B7587">${url}</text>

  <!-- photo frame -->
  <rect x="808" y="128" width="312" height="376" rx="28" fill="#10141C" stroke="url(#signal)" stroke-width="3"/>
  <text x="964" y="548" text-anchor="middle" font-family="${FONT}" font-style="italic" font-size="21" fill="#C4CCD8">${tagline}</text>
</svg>`;

const PHOTO_W = 296;
const PHOTO_H = 360;
const mask = Buffer.from(`<svg width="${PHOTO_W}" height="${PHOTO_H}"><rect width="${PHOTO_W}" height="${PHOTO_H}" rx="22" fill="#fff"/></svg>`);
const photo = await sharp(PHOTO)
  .resize(PHOTO_W, PHOTO_H, { fit: 'cover', position: 'attention' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(Buffer.from(background))
  .composite([{ input: photo, left: 816, top: 136 }])
  .png({ compressionLevel: 9, palette: false })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`${OUT}: ${meta.width}×${meta.height}`);
