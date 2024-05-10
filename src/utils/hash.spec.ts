import { hashKey, parseHashBuffer, validateHash } from "./hash"

describe("Hash utils", () => {
  it("Should create base64 encoded sha256 hash on hashKey", () => {
    const result = hashKey("key", "salt")
    expect(result).toEqual(
      Buffer.from("I70H7quISNoVufzjPDMHnu/icdHdZyQ3oCuT+qhXqLE=", "base64"),
    )
  })

  it("Should call buffer toString on parseHashBuffer", () => {
    const parsedHash = "parsed-hash"
    const buffer = {
      toString: jest.fn().mockReturnValue(parsedHash),
    } as unknown as Buffer

    const result = parseHashBuffer(buffer)

    expect(result).toBe(parsedHash)
    expect(buffer.toString).toHaveBeenCalledWith("base64")
  })

  it("Should test hash with validateHash", () => {
    const validHash = "I70H7quISNoVufzjPDMHnu/icdHdZyQ3oCuT+qhXqLE="
    const providedHash = Buffer.from(validHash, "base64")
    const result = validateHash(providedHash, validHash)
    expect(result).toEqual(true)
  })
})
