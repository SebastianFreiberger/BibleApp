import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, ZoomIn, Loader } from 'lucide-react'
import { getCoverScale, getMaxPan, clamp, getSourceRect } from './avatarCropMath'

const FRAME = 300
const OUTPUT = 600
const MAX_USER_SCALE = 3

export function AvatarCropModal({ file, onCancel, onSave, saving, t }) {
  const [imgEl, setImgEl] = useState(null)
  const [userScale, setUserScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => setImgEl(img)
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  const baseScale = imgEl ? getCoverScale(imgEl.width, imgEl.height, FRAME) : 1
  const maxPanX = imgEl ? getMaxPan(imgEl.width, baseScale, userScale, FRAME) : 0
  const maxPanY = imgEl ? getMaxPan(imgEl.height, baseScale, userScale, FRAME) : 0
  const dispW = imgEl ? imgEl.width * baseScale * userScale : 0
  const dispH = imgEl ? imgEl.height * baseScale * userScale : 0

  const startDrag = (clientX, clientY) => {
    dragRef.current = { startX: clientX, startY: clientY, panX: pan.x, panY: pan.y }
  }
  const moveDrag = (clientX, clientY) => {
    if (!dragRef.current) return
    const dx = clientX - dragRef.current.startX
    const dy = clientY - dragRef.current.startY
    setPan({
      x: clamp(dragRef.current.panX + dx, -maxPanX, maxPanX),
      y: clamp(dragRef.current.panY + dy, -maxPanY, maxPanY),
    })
  }
  const endDrag = () => { dragRef.current = null }

  const handleScaleChange = (e) => {
    const next = Number(e.target.value)
    setUserScale(next)
    const nextMaxX = getMaxPan(imgEl.width, baseScale, next, FRAME)
    const nextMaxY = getMaxPan(imgEl.height, baseScale, next, FRAME)
    setPan(p => ({ x: clamp(p.x, -nextMaxX, nextMaxX), y: clamp(p.y, -nextMaxY, nextMaxY) }))
  }

  const handleSave = () => {
    if (!imgEl) return
    const { sx, sy, sSize } = getSourceRect({
      imgW: imgEl.width, imgH: imgEl.height, frame: FRAME,
      baseScale, userScale, panX: pan.x, panY: pan.y,
    })
    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT
    canvas.height = OUTPUT
    const ctx = canvas.getContext('2d')
    ctx.drawImage(imgEl, sx, sy, sSize, sSize, 0, 0, OUTPUT, OUTPUT)
    canvas.toBlob(blob => { if (blob) onSave(blob) }, 'image/jpeg', 0.92)
  }

  return createPortal(
    <div className="crop-overlay" onClick={onCancel}>
      <div className="crop-modal" onClick={e => e.stopPropagation()}>
        <div className="crop-modal-header">
          <h3>{t.cropTitle}</h3>
          <button className="crop-close-btn" onClick={onCancel} aria-label={t.cropCancel}>
            <X size={18} />
          </button>
        </div>

        <p className="crop-hint">{t.cropHint}</p>

        <div
          className="crop-frame"
          style={{ width: FRAME, height: FRAME }}
          onMouseDown={e => startDrag(e.clientX, e.clientY)}
          onMouseMove={e => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={e => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={endDrag}
        >
          {imgEl ? (
            <>
              <img
                src={imgEl.src}
                alt=""
                draggable={false}
                className="crop-frame-img"
                style={{
                  width: dispW,
                  height: dispH,
                  transform: `translate(${(FRAME - dispW) / 2 + pan.x}px, ${(FRAME - dispH) / 2 + pan.y}px)`,
                }}
              />
              <div className="crop-frame-grid" />
            </>
          ) : (
            <div className="crop-frame-loading"><Loader size={22} className="spin" /></div>
          )}
        </div>

        <div className="crop-zoom">
          <ZoomIn size={16} />
          <input
            type="range" min="1" max={MAX_USER_SCALE} step="0.01"
            value={userScale} onChange={handleScaleChange}
            disabled={!imgEl}
            aria-label={t.cropZoomLabel}
          />
        </div>

        <div className="crop-actions">
          <button className="pi-btn-cancel" onClick={onCancel} disabled={saving}>{t.cropCancel}</button>
          <button className="pi-btn-save" onClick={handleSave} disabled={saving || !imgEl}>
            {saving ? t.cropUploading : <><Check size={15} /> {t.cropSave}</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
