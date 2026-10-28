import { expect, test } from "vitest"

import { createTorrent, sha1 } from "./torrent-create"
import { parseTorrentMetainfo } from "./torrent-metainfo"

const hex = (b: Uint8Array) =>
  Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("")

test("sha1 matches known vectors", () => {
  expect(hex(sha1(new TextEncoder().encode("abc")))).toBe(
    "a9993e364706816aba3e25717850c26c9cd0d89d",
  )
  expect(hex(sha1(new Uint8Array(0)))).toBe(
    "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  )
})

test("creates a torrent and nfo that round-trip", async () => {
  const file = new File([new Uint8Array(40000).fill(7)], "data.bin")
  const { torrent, infoHash, nfo } = await createTorrent(file, {
    announce: "http://t.example/announce",
    pieceLength: 16384,
  })

  expect(parseTorrentMetainfo(torrent).files).toEqual([
    { index: 0, path: "data.bin", length: 40000 },
  ])
  expect(infoHash).toMatch(/^[0-9a-f]{40}$/)
  expect(nfo).toContain(infoHash)
  expect(nfo).toContain("3 pieces")
})
