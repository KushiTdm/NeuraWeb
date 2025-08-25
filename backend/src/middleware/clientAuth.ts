import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface ClientAuthRequest extends Request {
  client?: any;
}

export const authenticateClient = async (
  req: ClientAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (decoded.type !== 'client') {
      return res.status(401).json({ error: 'Invalid token type.' });
    }

    req.client = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const requireValidatedClient = async (
  req: ClientAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.client?.isValidated) {
    return res.status(403).json({ 
      error: 'Account not validated. Please wait for admin approval.' 
    });
  }
  next();
};