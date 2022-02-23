import bcrypt from 'bcrypt'
import Joi from 'joi'
import jwt from 'jsonwebtoken'

export const JWT_SECRET: any = process.env.JWT_SECRET
export const JWT_ALGORITHM: any = process.env.JWT_ALGORITHM || 'HS256'
export const ACCESS_TOKEN_EXPIRES_IN =
  process.env.ACCESS_TOKEN_EXPIRES_IN || '1d'
export const REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN || '3d'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET env is not set')
}

export async function generateToken(
  payload: any,
  expiresIn: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        algorithm: JWT_ALGORITHM,
        expiresIn
      },
      (err, encoded) => {
        if (encoded) resolve(encoded)
        else reject(err)
      }
    )
  })
}

export async function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      JWT_SECRET,
      {
        algorithms: [JWT_ALGORITHM]
      },
      (err, payload) => {
        if (payload) resolve(payload)
        else reject(err)
      }
    )
  })
}

export async function validatePassword(
  passHash: string | null,
  password: string
): Promise<boolean> {
  if (!passHash) {
    return false
  }
  return await bcrypt.compare(password, passHash)
}

export async function hashPassword(password: string) {
  if (!password) {
    return password
  }
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

export const authenticationSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  password: Joi.string().min(6).max(50).required()
})
