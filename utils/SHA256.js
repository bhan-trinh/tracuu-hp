// Hash a string with SHA-256
function SHA256(string) {
  return createHash("sha256").update(string).digest("hex");
}