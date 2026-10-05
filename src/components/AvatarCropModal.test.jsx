import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AvatarCropModal } from './AvatarCropModal'

const t = {
  cropTitle: 'Ajustá tu foto',
  cropHint: 'Arrastrá para mover',
  cropZoomLabel: 'Zoom',
  cropCancel: 'Cancelar',
  cropSave: 'Guardar',
  cropUploading: 'Subiendo...',
}

const fakeFile = new File(['fake-bytes'], 'photo.jpg', { type: 'image/jpeg' })

beforeEach(() => {
  vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:fake'), revokeObjectURL: vi.fn() })

  // jsdom no implementa la carga real de imágenes: simulamos onload inmediato
  // con dimensiones fijas para poder ejercitar el flujo de recorte.
  vi.stubGlobal('Image', class {
    set src(_v) {
      this.width = 400
      this.height = 200
      this.onload?.()
    }
  })

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({ drawImage: vi.fn() }))
  HTMLCanvasElement.prototype.toBlob = vi.fn(function (cb) {
    cb(new Blob(['cropped'], { type: 'image/jpeg' }))
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('AvatarCropModal', () => {
  it('calls onCancel when the close button is clicked', () => {
    const onCancel = vi.fn()
    render(<AvatarCropModal file={fakeFile} onCancel={onCancel} onSave={vi.fn()} saving={false} t={t} />)

    fireEvent.click(screen.getByLabelText('Cancelar'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('exports a cropped blob to onSave when Guardar is clicked', async () => {
    const onSave = vi.fn()
    render(<AvatarCropModal file={fakeFile} onCancel={vi.fn()} onSave={onSave} saving={false} t={t} />)

    await waitFor(() => expect(screen.getByRole('button', { name: /guardar/i })).not.toBeDisabled())
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1))
    expect(onSave.mock.calls[0][0]).toBeInstanceOf(Blob)
  })

  it('disables the save button while saving', async () => {
    render(<AvatarCropModal file={fakeFile} onCancel={vi.fn()} onSave={vi.fn()} saving={true} t={t} />)
    await waitFor(() => {
      expect(screen.getByText('Subiendo...')).toBeInTheDocument()
    })
  })
})
