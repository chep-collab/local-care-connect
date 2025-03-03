import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Caregiver } from '../models/Caregiver';

interface JwtPayload {
  id: string;
  role: 'caregiver' | 'patient';
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
      userRole?: string;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Add user info to request
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // If it's a caregiver, verify their status
    if (decoded.role === 'caregiver') {
      const caregiver = await Caregiver.findById(decoded.id);
      if (!caregiver) {
        return res.status(401).json({ error: 'Caregiver not found' });
      }

      if (caregiver.verificationStatus === 'rejected') {
        return res.status(403).json({ error: 'Account verification rejected' });
      }
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const requireVerifiedStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.userRole !== 'caregiver') {
      return next();
    }

    const caregiver = await Caregiver.findById(req.userId);
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    if (caregiver.verificationStatus !== 'verified') {
      return res.status(403).json({ 
        error: 'Account not verified',
        status: caregiver.verificationStatus
      });
    }

    next();
  } catch (error) {
    console.error('Verification middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
