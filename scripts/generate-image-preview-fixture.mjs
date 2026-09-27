import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

// Produce the Storybook preview fixture from simple shapes, without external art.
const width = 360;
const height = 220;
const pixels = Buffer.alloc(height * (1 + width * 3));

for (let y = 0; y < height; y += 1) {
  const row = y * (1 + width * 3);
  for (let x = 0; x < width; x += 1) {
    const offset = row + 1 + x * 3;
    const circle = (x - 258) ** 2 + (y - 69) ** 2 < 34 ** 2;
    const hill = y > 152 - 0.18 * x && y < 206;
    const foreground = y > 115 + 0.4 * x && y < 206;
    const color = circle
      ? [218, 168, 111]
      : foreground
        ? [64, 79, 72]
        : hill
          ? [148, 163, 144]
          : [231, 233, 226];
    pixels[offset] = color[0];
    pixels[offset + 1] = color[1];
    pixels[offset + 2] = color[2];
  }
}

const crc32 = (data) => {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
};

const header = Buffer.alloc(13);
header.writeUInt32BE(width, 0);
header.writeUInt32BE(height, 4);
header[8] = 8; // RGB, 8 bits per channel.
header[9] = 2;

const image = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", header),
  chunk("IDAT", deflateSync(pixels)),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync(
  fileURLToPath(
    new URL(
      "../src/components/image-preview/sample-preview.png",
      import.meta.url,
    ),
  ),
  image,
);
