import { isFutureDate } from "./date"

describe("Date utils: isFutureDate", () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2024, 5, 9))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it("Should return false for current date", () => {
    expect(isFutureDate(new Date())).toBe(false)
  })

  it("Should return false for past dates", () => {
    const pastDates = [
      new Date(1638485413000),
      new Date(1706827813000),
      new Date(1714603813000),
    ]
    expect(isFutureDate(pastDates[0])).toBe(false)
    expect(isFutureDate(pastDates[1])).toBe(false)
    expect(isFutureDate(pastDates[2])).toBe(false)
  })

  it("Should return true for future year", () => {
    const futureDate = new Date()
    futureDate.setFullYear(2130)
    expect(isFutureDate(futureDate)).toBe(true)
  })

  it("Should return true for future month", () => {
    const futureDate = new Date()
    futureDate.setMonth(7)
    expect(isFutureDate(futureDate)).toBe(true)
  })

  it("Should return true for future day", () => {
    const futureDate = new Date()
    futureDate.setDate(13)
    expect(isFutureDate(futureDate)).toBe(true)
  })
})
