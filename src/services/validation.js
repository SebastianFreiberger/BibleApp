// Validación de formato de teléfono. No se restringe a un país en particular:
// solo se permiten los caracteres típicos de un número de teléfono y se exige
// una cantidad razonable de dígitos (8 a 15, rango del estándar E.164).
export function isValidPhone(phone) {
  const trimmed = phone?.trim() ?? ''
  if (!trimmed) return true
  if (!/^[\d+\s()-]+$/.test(trimmed)) return false
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 15
}
