import bencode from "bencode"

export interface CreateTorrentOptions {
  announce?: string
  pieceLength?: number
  comment?: string
}

export interface CreatedTorrent {
  torrent: Uint8Array
  infoHash: string
  nfo: string
}

// Pure-JS SHA-1: crypto.subtle is unavailable over plain HTTP (see #36).
// ponytail: ~10x slower than native, use crypto.subtle when isSecureContext if big files matter
export function sha1(data: Uint8Array): Uint8Array {
  const total = (((data.length + 8) >> 6) << 6) + 64
  const padded = new Uint8Array(total)
  padded.set(data)
  padded[data.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(total - 8, Math.floor((data.length * 8) / 2 ** 32))
  view.setUint32(total - 4, (data.length * 8) >>> 0)

  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]
  const w = new Uint32Array(80)
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4)
    for (let i = 16; i < 80; i++) {
      const x = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]
      w[i] = (x << 1) | (x >>> 31)
    }
    let [a, b, c, d, e] = h
    for (let i = 0; i < 80; i++) {
      const [f, k] =
        i < 20
          ? [(b & c) | (~b & d), 0x5a827999]
          : i < 40
            ? [b ^ c ^ d, 0x6ed9eba1]
            : i < 60
              ? [(b & c) | (b & d) | (c & d), 0x8f1bbcdc]
              : [b ^ c ^ d, 0xca62c1d6]
      const t = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) >>> 0
      e = d
      d = c
      c = (b << 30) | (b >>> 2)
      b = a
      a = t
    }
    ;[a, b, c, d, e].forEach((v, i) => (h[i] = (h[i] + v) >>> 0))
  }

  const out = new Uint8Array(20)
  h.forEach((v, i) => new DataView(out.buffer).setUint32(i * 4, v))
  return out
}

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")

// Aim for <= ~1500 pieces, power of two between 16 KiB and 16 MiB.
function autoPieceLength(size: number): number {
  let length = 16 * 1024
  while (length < 16 * 1024 * 1024 && size / length > 1500) length *= 2
  return length
}

// ponytail: single-file torrents only, add a directory walk for multi-file
export async function createTorrent(
  file: File,
  options: CreateTorrentOptions = {},
): Promise<CreatedTorrent> {
  const pieceLength = options.pieceLength ?? autoPieceLength(file.size)
  const pieceCount = Math.ceil(file.size / pieceLength)
  const pieces = new Uint8Array(pieceCount * 20)
  for (let i = 0; i < pieceCount; i++) {
    const chunk = file.slice(i * pieceLength, (i + 1) * pieceLength)
    pieces.set(sha1(new Uint8Array(await chunk.arrayBuffer())), i * 20)
  }

  const info = {
    name: file.name,
    length: file.size,
    "piece length": pieceLength,
    pieces,
  }
  const infoHash = toHex(sha1(bencode.encode(info)))
  const torrent = bencode.encode({
    ...(options.announce && { announce: options.announce }),
    ...(options.comment && { comment: options.comment }),
    "created by": "transmission-next-ui",
    "creation date": Math.floor(Date.now() / 1000),
    info,
  })

  const nfo = [
    `Name         : ${file.name}`,
    `Size         : ${file.size} bytes`,
    `Piece length : ${pieceLength} bytes (${pieceCount} pieces)`,
    `Info hash    : ${infoHash}`,
    options.announce && `Tracker      : ${options.announce}`,
    options.comment && `Comment      : ${options.comment}`,
  ]
    .filter(Boolean)
    .join("\n")

  return { torrent, infoHash, nfo: `${nfo}\n` }
}
