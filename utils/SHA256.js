const { createHash } = require('crypto')

// Hash a string with SHA-256
module.exports = {
  SHA256: (string) => {
    return createHash("sha256").update(string).digest("hex");
  },
};
