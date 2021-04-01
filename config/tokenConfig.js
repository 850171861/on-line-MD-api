import jwt from 'jsonwebtoken'

export const JWT_SECRET = 'wmaw1i0IdL1l1o%OUOTo$Zwgsjmflaw%Fwq'
export const getJwtVerify = (token) => {
  return jwt.verify(token, JWT_SECRET)
}
