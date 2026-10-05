// Matemática pura del recorte de avatar — separada del componente para poder
// testearla sin necesidad de un <canvas> real (jsdom no lo soporta).

// Escala mínima para que la imagen cubra todo el marco circular (como
// object-fit: cover), antes de aplicar el zoom que elige el usuario.
export function getCoverScale(imgW, imgH, frame) {
  return Math.max(frame / imgW, frame / imgH)
}

// Cuánto se puede desplazar (arrastrar) la imagen en un eje sin que queden
// huecos vacíos dentro del marco, dado el tamaño de ese eje y el zoom actual.
export function getMaxPan(imgSize, baseScale, userScale, frame) {
  const displayed = imgSize * baseScale * userScale
  return Math.max(0, (displayed - frame) / 2)
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// Rectángulo (en coordenadas de la imagen original) que cae dentro del marco
// visible, para recortarlo con ctx.drawImage(img, sx, sy, sSize, sSize, ...).
export function getSourceRect({ imgW, imgH, frame, baseScale, userScale, panX, panY }) {
  const dispScale = baseScale * userScale
  const dispW = imgW * dispScale
  const dispH = imgH * dispScale
  const left = (frame - dispW) / 2 + panX
  const top = (frame - dispH) / 2 + panY
  return {
    sx: -left / dispScale,
    sy: -top / dispScale,
    sSize: frame / dispScale,
  }
}
