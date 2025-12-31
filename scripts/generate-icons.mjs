import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create an SVG with a football emoji design
const createIconSVG = (size, maskable = false) => {
  const padding = maskable ? size * 0.2 : 0; // 20% safe zone for maskable
  const emojiSize = size - (padding * 2);
  const emojiFontSize = emojiSize * 0.7;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f4d2d;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0a2b1b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        font-size="${emojiFontSize}px"
        transform="translate(0, ${size * 0.05})"
      >⚽</text>
    </svg>
  `.trim();
};

// Generate icons
async function generateIcons() {
  console.log('🎨 Generating PWA icons...');

  try {
    // Ensure public directory exists
    mkdirSync('./public', { recursive: true });

    // Generate 192x192
    console.log('  → Creating icon-192.png...');
    await sharp(Buffer.from(createIconSVG(192)))
      .png()
      .toFile('./public/icon-192.png');

    // Generate 512x512
    console.log('  → Creating icon-512.png...');
    await sharp(Buffer.from(createIconSVG(512)))
      .png()
      .toFile('./public/icon-512.png');

    // Generate 512x512 maskable (with safe zone)
    console.log('  → Creating icon-maskable-512.png...');
    await sharp(Buffer.from(createIconSVG(512, true)))
      .png()
      .toFile('./public/icon-maskable-512.png');

    console.log('✅ Icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
