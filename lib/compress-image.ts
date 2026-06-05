export async function compressImage(file: File, maxSizeMB = 1.5): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const maxDim = 1400
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Compression failed')); return }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.82
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      // Return original file if compression fails
      resolve(file)
    }
    img.src = url
  })
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target!.result as string
      resolve(dataUrl.split(',')[1]) // Strip data: prefix
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
