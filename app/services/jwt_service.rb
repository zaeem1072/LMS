class JwtService
  SECRET_KEY = "48fef2cbfd1bc29fbe0f0afa0ad75bfea47c5e7c6bb4a0ef5e6d194f2c0a70721a9d35896b2029480cb4c45f562a81b060472828aa2630d4dc0e6a6f079e4bbc"

  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    payload[:jti] = SecureRandom.uuid
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    decoded = HashWithIndifferentAccess.new(decoded)
    decoded
  rescue JWT::DecodeError => e
    nil
  end

  def self.blacklist_token(token)
    true
  end
end
