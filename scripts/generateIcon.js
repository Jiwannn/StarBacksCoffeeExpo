const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a 1024x1024 green PNG icon for StarBacks Coffee
const width = 1024;
const height = 1024;

function createPNG(width, height) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // Image data - green background (#00704A) with white circle
  const rawData = [];
  const bgR = 0x00, bgG = 0x70, bgB = 0x4A;
  const fgR = 0xFF, fgG = 0xFF, fgB = 0xFF;
  const cx = width / 2, cy = height / 2, r = width * 0.35;

  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      const dx = x - cx, dy = y - cy;
      const inCircle = (dx * dx + dy * dy) <= r * r;
      rawData.push(inCircle ? fgR : bgR);
      rawData.push(inCircle ? fgG : bgG);
      rawData.push(inCircle ? fgB : bgB);
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idat = createChunk('IDAT', compressed);
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([len, typeBuffer, data, crc]);
}

function crc32(buf) {
  const table = makeCRCTable();
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeCRCTable() {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
}

const png = createPNG(width, height);
const outputPath = path.join(__dirname, '..', 'src', 'assets', 'images', 'icon.png');
fs.writeFileSync(outputPath, png);
console.log(`✅ Created ${width}x${height} PNG icon at ${outputPath}`);
