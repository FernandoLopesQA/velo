export function generateOrderCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const suffix = Array.from({ length: 6 }, () => {
    const randomIndex = Math.floor(Math.random() * chars.length)
    return chars[randomIndex]
  }).join('')

  return `VLO-${suffix}`
}