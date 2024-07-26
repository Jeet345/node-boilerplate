const crypto = require('crypto');

const { ENCRYPTION } = require('../../config/config');

class Encryption {
  constructor(encryptionKeys = {}) {
    this.secret = encryptionKeys.secret || ENCRYPTION.SECRET;
    this.iv = encryptionKeys.secret || ENCRYPTION.IV;
  }

  encryptWithAES(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.secret, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  decryptWithAES(cipherText) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.secret, this.iv);
    const decrypted = decipher.update(cipherText, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  }
}

const encryption = new Encryption();

module.exports = encryption;
