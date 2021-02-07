const crypto = require('crypto');

// # This helper gives some hashing, needs work. Note to self: checkout this
//   https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/
let encrypt = function cipher(input) {
    const key = crypto.createHash("sha256").update(input).digest("hex");
    return key
}

module.exports = encrypt;