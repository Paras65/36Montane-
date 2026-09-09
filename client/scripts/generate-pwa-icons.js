import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function generatePNG(width, height) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines (filter byte 0 + RGBA)
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  let pos = 0;

  const bgR = 17, bgG = 38, bgB = 29; // #11261D deep forest green
  const terraR = 200, terraG = 75, terraB = 49; // #C84B31 terracotta
  const goldR = 233, goldG = 196, goldB = 106; // #E9C46A dokra gold
  const snowR = 250, snowG = 246, snowB = 240; // #FAF6F0 kosa silk

  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.44;

  for (let y = 0; y < height; y++) {
    rawData[pos++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      let rPix = bgR, gPix = bgG, bPix = bgB, aPix = 255;

      const distCenter = Math.hypot(x - cx, y - cy);
      if (distCenter <= r) {
        if (distCenter >= r - (width * 0.03)) {
          rPix = goldR; gPix = goldG; bPix = goldB;
        } else {
          // Sun in sky
          const sunDist = Math.hypot(x - (cx + width * 0.18), y - (cy - height * 0.15));
          if (sunDist <= width * 0.11) {
            rPix = goldR; gPix = goldG; bPix = goldB;
          }

          // Mountain 1 (Terracotta)
          const m1PeakX = cx - width * 0.12;
          const m1PeakY = cy - height * 0.22;
          const slope1 = 1.1;
          const m1HeightAtX = m1PeakY + Math.abs(x - m1PeakX) * slope1;

          // Mountain 2 (Sal Forest)
          const m2PeakX = cx + width * 0.2;
          const m2PeakY = cy - height * 0.1;
          const slope2 = 1.2;
          const m2HeightAtX = m2PeakY + Math.abs(x - m2PeakX) * slope2;

          if (y >= m1HeightAtX && y <= cy + height * 0.3) {
            if (y - m1HeightAtX < width * 0.08) {
              rPix = snowR; gPix = snowG; bPix = snowB;
            } else {
              rPix = terraR; gPix = terraG; bPix = terraB;
            }
          } else if (y >= m2HeightAtX && y <= cy + height * 0.3) {
            rPix = 27; gPix = 67; bPix = 50; // #1B4332
          }

          // Tent at bottom center
          const tentPeakX = cx;
          const tentPeakY = cy + height * 0.1;
          const tentBaseY = cy + height * 0.28;
          const tentSlope = 1.3;
          const tentHeightAtX = tentPeakY + Math.abs(x - tentPeakX) * tentSlope;
          if (y >= tentHeightAtX && y <= tentBaseY) {
            rPix = goldR; gPix = goldG; bPix = goldB;
            if (x < cx && y > tentPeakY + height * 0.06) {
              rPix = terraR; gPix = terraG; bPix = terraB;
            }
          }
        }
      }

      rawData[pos++] = rPix;
      rawData[pos++] = gPix;
      rawData[pos++] = bPix;
      rawData[pos++] = aPix;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.resolve('public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), generatePNG(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), generatePNG(512, 512));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), generatePNG(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), generatePNG(512, 512));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), generatePNG(180, 180));

console.log('PWA PNG icons generated successfully in client/public/icons/');

