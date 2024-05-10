export function isFutureDate(date: Date) {
  const handledDate = new Date(date)
  const current = new Date()

  if (handledDate.getFullYear() > current.getFullYear()) return true
  if (handledDate.getFullYear() < current.getFullYear()) return false

  if (handledDate.getMonth() > current.getMonth()) return true
  if (handledDate.getMonth() < current.getMonth()) return false

  return handledDate.getDate() > current.getDate()
}
