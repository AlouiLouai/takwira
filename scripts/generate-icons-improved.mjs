import sharp from 'sharp';
import { mkdirSync } from 'fs';

// Create a better football/soccer ball SVG (not using emoji text)
const createFootballSVG = (size, maskable = false) => {
  const padding = maskable ? size * 0.2 : size * 0.1;
  const ballSize = size - (padding * 2);
  const ballRadius = ballSize / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f4d2d;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0a2b1b;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="ballGrad" cx="40%" cy="40%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#f0f0f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d0d0d0;stop-opacity:1" />
        </radialGradient>
      </defs>

      <!-- Background -->
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bgGrad)"/>

      <!-- Football/Soccer Ball -->
      <circle cx="${centerX}" cy="${centerY}" r="${ballRadius}" fill="url(#ballGrad)"/>

      <!-- Pentagon in center (black) -->
      <polygon
        points="${centerX},${centerY - ballRadius * 0.35} ${centerX + ballRadius * 0.33},${centerY - ballRadius * 0.1} ${centerX + ballRadius * 0.2},${centerY + ballRadius * 0.3} ${centerX - ballRadius * 0.2},${centerY + ballRadius * 0.3} ${centerX - ballRadius * 0.33},${centerY - ballRadius * 0.1}"
        fill="#1a1a1a"
      />

      <!-- Hexagons around (black patches) -->
      <!-- Top right hexagon -->
      <path d="M ${centerX + ballRadius * 0.2} ${centerY - ballRadius * 0.5}
               L ${centerX + ballRadius * 0.5} ${centerY - ballRadius * 0.35}
               L ${centerX + ballRadius * 0.5} ${centerY - ballRadius * 0.05}
               L ${centerX + ballRadius * 0.3} ${centerY}
               L ${centerX + ballRadius * 0.1} ${centerY - ballRadius * 0.15}
               Z"
        fill="#1a1a1a"/>

      <!-- Bottom left hexagon -->
      <path d="M ${centerX - ballRadius * 0.2} ${centerY + ballRadius * 0.5}
               L ${centerX - ballRadius * 0.5} ${centerY + ballRadius * 0.35}
               L ${centerX - ballRadius * 0.5} ${centerY + ballRadius * 0.05}
               L ${centerX - ballRadius * 0.3} ${centerY}
               L ${centerX - ballRadius * 0.1} ${centerY + ballRadius * 0.15}
               Z"
        fill="#1a1a1a"/>

      <!-- Left hexagon -->
      <path d="M ${centerX - ballRadius * 0.6} ${centerY - ballRadius * 0.1}
               L ${centerX - ballRadius * 0.5} ${centerY - ballRadius * 0.35}
               L ${centerX - ballRadius * 0.25} ${centerY - ballRadius * 0.4}
               L ${centerX - ballRadius * 0.1} ${centerY - ballRadius * 0.2}
               L ${centerX - ballRadius * 0.2} ${centerY + ballRadius * 0.05}
               L ${centerX - ballRadius * 0.45} ${centerY + ballRadius * 0.1}
               Z"
        fill="#1a1a1a"/>
    </svg>
  `.trim();
};

// Generate icons
async function generateIcons() {
  console.log('⚽ Generating improved PWA icons...');

  try {
    mkdirSync('./public', { recursive: true });

    // Generate 192x192
    console.log('  → Creating icon-192.png...');
    await sharp(Buffer.from(createFootballSVG(192)))
      .png()
      .toFile('./public/icon-192.png');

    // Generate 512x512
    console.log('  → Creating icon-512.png...');
    await sharp(Buffer.from(createFootballSVG(512)))
      .png()
      .toFile('./public/icon-512.png');

    // Generate 512x512 maskable (with safe zone)
    console.log('  → Creating icon-maskable-512.png...');
    await sharp(Buffer.from(createFootballSVG(512, true)))
      .png()
      .toFile('./public/icon-maskable-512.png');

    // Generate Apple Touch Icon (180x180)
    console.log('  → Creating apple-touch-icon.png...');
    await sharp(Buffer.from(createFootballSVG(180)))
      .png()
      .toFile('./public/apple-touch-icon.png');

    // Generate favicon (32x32)
    console.log('  → Creating favicon-32x32.png...');
    await sharp(Buffer.from(createFootballSVG(32)))
      .png()
      .toFile('./public/favicon-32x32.png');

    // Generate favicon (16x16)
    console.log('  → Creating favicon-16x16.png...');
    await sharp(Buffer.from(createFootballSVG(16)))
      .png()
      .toFile('./public/favicon-16x16.png');

    // Generate favicon.ico (using 32x32)
    console.log('  → Creating favicon.ico...');
    await sharp(Buffer.from(createFootballSVG(32)))
      .png()
      .toFile('./public/favicon.ico');

    console.log('✅ All icons generated successfully!');
    console.log('\nGenerated files:');
    console.log('  - icon-192.png (PWA)');
    console.log('  - icon-512.png (PWA)');
    console.log('  - icon-maskable-512.png (PWA maskable)');
    console.log('  - apple-touch-icon.png (iOS)');
    console.log('  - favicon.ico (Browser)');
    console.log('  - favicon-16x16.png');
    console.log('  - favicon-32x32.png');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
