import { describe, it, expect } from 'vitest'
import { getCoverScale, getMaxPan, clamp, getSourceRect } from './avatarCropMath'

describe('getCoverScale', () => {
  it('returns 1 when the image already matches the frame size', () => {
    expect(getCoverScale(260, 260, 260)).toBe(1)
  })

  it('picks the larger ratio so a landscape image covers the whole frame', () => {
    // 400x200 image into a 260 frame: width ratio 0.65, height ratio 1.3 → covers via height
    expect(getCoverScale(400, 200, 260)).toBeCloseTo(1.3)
  })

  it('picks the larger ratio so a portrait image covers the whole frame', () => {
    expect(getCoverScale(200, 400, 260)).toBeCloseTo(1.3)
  })
})

describe('getMaxPan', () => {
  it('returns 0 when the scaled image exactly fills the frame (no room to drag)', () => {
    expect(getMaxPan(200, 1.3, 1, 260)).toBe(0)
  })

  it('returns half the overflow when the scaled image is larger than the frame', () => {
    // 400 * 1.3 = 520 displayed, frame 260 → overflow 260, half = 130
    expect(getMaxPan(400, 1.3, 1, 260)).toBeCloseTo(130)
  })

  it('never returns a negative value', () => {
    expect(getMaxPan(100, 1, 1, 260)).toBe(0)
  })
})

describe('clamp', () => {
  it('passes values through unchanged when inside range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it('clamps to the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })
  it('clamps to the maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })
})

describe('getSourceRect', () => {
  it('crops the overflowing sides of a landscape image centered with no pan', () => {
    const rect = getSourceRect({
      imgW: 400, imgH: 200, frame: 260, baseScale: 1.3, userScale: 1, panX: 0, panY: 0,
    })
    expect(rect.sx).toBeCloseTo(100)
    expect(rect.sy).toBeCloseTo(0)
    expect(rect.sSize).toBeCloseTo(200)
  })

  it('shifts the crop window when the user pans the image', () => {
    const centered = getSourceRect({
      imgW: 400, imgH: 200, frame: 260, baseScale: 1.3, userScale: 1, panX: 0, panY: 0,
    })
    const panned = getSourceRect({
      imgW: 400, imgH: 200, frame: 260, baseScale: 1.3, userScale: 1, panX: 26, panY: 0,
    })
    // Panning the image right by 26 screen px moves the visible source window left
    expect(panned.sx).toBeLessThan(centered.sx)
  })
})
