// src/utils/decrypt.js
import CryptoJS from "crypto-js";

// Make sure this key matches your Node.js secret key
const SECRET_KEY = process.env.REACT_APP_DATA_SECRET_KEY || "supersecretkey";

/**
 * Decrypts an AES-encrypted string into JSON.
 * @param {string} encryptedData - The encrypted string from backend
 * @returns {Object|Array} - Decrypted data
 */
export function decryptData(encryptedData) {
  if (!encryptedData) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decryption Error:", err);
    return null;
  }
}