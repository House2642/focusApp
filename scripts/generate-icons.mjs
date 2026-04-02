/**
 * Generates minimal valid PNG icons for the ReGround PWA.
 * Uses only Node.js built-ins (zlib). No external dependencies.
 *
 * Icon: warm amber circle on dark background.
 */
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, '../public/icons')

mkdirSync(OUTPUT_DIR, { recursive: true })

function crc32(buf) {
  let crc = 0xffffffff
  const table = []
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const payload = Buffer.concat([typeBytes, data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(payload))
  return Buffer.concat([len, typeBytes, data, crc])
}

function generatePNG(size, bgR, bgG, bgB, circleR, circleG, circleB) {
  // IHDR
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)   // width
  ihdrData.writeUInt32BE(size, 4)   // height
  ihdrData[8] = 8                   // bit depth
  ihdrData[9] = 2                   // color type: RGB
  ihdrData[10] = 0                  // compression
  ihdrData[11] = 0                  // filter
  ihdrData[12] = 0                  // interlace

  // Build raw scanlines
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.38
  const innerRadius = size * 0.12   // small inner dot

  const rawRows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3) // filter byte + RGB pixels
    row[0] = 0 // None filter
    for (let x = 0; x < size; x++) {
      const dx = x - centerX
      const dy = y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)

      let r, g, b
      if (dist <= radius) {
        // Amber circle
        r = circleR; g = circleG; b = circleB
        // Soft inner dot for depth
        if (dist <= innerRadius) {
          const mix = 1 - dist / innerRadius
          r = Math.round(r + (255 - r) * mix * 0.3)
          g = Math.round(g + (255 - g) * mix * 0.3)
          b = Math.round(b + (255 - b) * mix * 0.3)
        }
      } else {
        // Dark background
        r = bgR; g = bgG; b = bgB
      }
      row[1 + x * 3] = r
      row[1 + x * 3 + 1] = g
      row[1 + x * 3 + 2] = b
    }
    rawRows.push(row)
  }

  const rawData = Buffer.concat(rawRows)
  const compressed = deflateSync(rawData, { level: 6 })

  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ])
}

// Dark bg: #1a1a1a, accent circle: #d4956a
const BG = [0x1a, 0x1a, 0x1a]
const ACCENT = [0xd4, 0x95, 0x6a]

const sizes = [
  { name: 'icon-192.png',        size: 192 },
  { name: 'icon-512.png',        size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
]

for (const { name, size } of sizes) {
  const png = generatePNG(size, ...BG, ...ACCENT)
  const outPath = join(OUTPUT_DIR, name)
  writeFileSync(outPath, png)
  console.log(`✓ ${name} (${size}×${size}) → ${outPath}`)
}
