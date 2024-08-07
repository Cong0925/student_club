import { JSEncrypt } from "jsencrypt";

export function encryptedData(data) {
  const encryptor = new JSEncrypt();
  const PUBLIC_KEY =
    "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK+b277rt0+nrAhJMTdzBjpHTpgdDoQXpDQ0qGBM1V4bW0njgdJnAlXZ5X3X8xhyHttO/AegOEFvGfwvoOLRiQ8CAwEAAQ==";

  encryptor.setPublicKey(PUBLIC_KEY);
  return encryptor.encrypt(data);
}
