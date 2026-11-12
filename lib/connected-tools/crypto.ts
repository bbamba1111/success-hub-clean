import "server-only"

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

function encryptionKey(): Buffer {
  const value = process.env.CONNECTED_TOOLS_ENCRYPTION_KEY
  if (!value || !/^[0-9a-f]{64}$/i.test(value)) {
    throw new Error("Connected tools encryption is not configured.")
  }
  return Buffer.from(value, "hex")
}

export function encryptConnectedSecret(value: string): string {
  if (!value) throw new Error("Cannot encrypt an empty credential.")
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return ["v1", iv.toString("base64url"), tag.toString("base64url"), ciphertext.toString("base64url")].join(".")
}

export function decryptConnectedSecret(envelope: string): string {
  const [version, ivPart, tagPart, ciphertextPart, extra] = envelope.split(".")
  if (version !== "v1" || !ivPart || !tagPart || !ciphertextPart || extra !== undefined) {
    throw new Error("Stored connected credential has an invalid format.")
  }

  const iv = Buffer.from(ivPart, "base64url")
  const tag = Buffer.from(tagPart, "base64url")
  const ciphertext = Buffer.from(ciphertextPart, "base64url")
  if (iv.length !== 12 || tag.length !== 16 || ciphertext.length === 0) {
    throw new Error("Stored connected credential is malformed.")
  }

  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8")
}

export function connectedToolsEncryptionKey(): string {
  const value = process.env.CONNECTED_TOOLS_ENCRYPTION_KEY
  if (!value || !/^[0-9a-f]{64}$/i.test(value)) {
    throw new Error("Connected tools encryption is not configured.")
  }
  return value
}
