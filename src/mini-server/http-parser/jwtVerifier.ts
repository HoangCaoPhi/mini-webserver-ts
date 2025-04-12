 
import jwt from 'jsonwebtoken';
import type { TokenVerifier } from '../abstractions/middleware.ts';

const SECRET = process.env.SECRET_KEY || 'default';

export const jwtVerifier: TokenVerifier = async (token) => {
  try {
    const payload = jwt.verify(token, SECRET) as any;
    if (payload?.id && payload?.name) {
      return { id: payload.id, name: payload.name };
    }
  } catch (err: any) {
    console.warn('JWT Invalid:', err.message);
  }
  return null;
};
