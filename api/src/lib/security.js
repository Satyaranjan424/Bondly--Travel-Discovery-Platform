import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

const hashPassword = (password, salt) => {
  return scryptSync(password, salt, 64).toString("hex");
};

export const createPasswordHash = (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);
  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  const [salt, expectedHash] = storedHash.split(":");

  if (!salt || !expectedHash) {
    return false;
  }

  const actualHash = hashPassword(password, salt);
  return timingSafeEqual(Buffer.from(actualHash, "hex"), Buffer.from(expectedHash, "hex"));
};

export const createToken = () => {
  return `${randomUUID()}-${randomBytes(24).toString("hex")}`;
};
