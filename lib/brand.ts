import { readFileSync } from 'fs'
import path from 'path'

// The brand logos in /public as data URIs, for the generated iOS icon and
// social-share image (next/og renders <img> from data URIs, not from paths).
function svgDataUri(file: string): string {
  const svg = readFileSync(path.join(process.cwd(), 'public', file))
  return `data:image/svg+xml;base64,${svg.toString('base64')}`
}

/** The mark alone (the compass "D"), 117×110. */
export const logoMark = { src: svgDataUri('logo.svg'), width: 117, height: 110 }

/** Mark + "DevRel Compass" wordmark, 312×106. */
export const logoLockup = { src: svgDataUri('logo-text.svg'), width: 312, height: 106 }

/** Tile behind the mark in the iOS icon — light, so the mauve mark stays legible. */
export const iconBackground = '#FFFFFF'
