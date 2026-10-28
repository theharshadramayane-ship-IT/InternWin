import jwt from 'jsonwebtoken';

const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '7d';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }
  return secret;
};

export const signToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRY });

export const verifyToken = (token) => jwt.verify(token, getJwtSecret());

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user?.role) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Access denied for this role.' });
  }

  next();
};

export const authenticateAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    req.user = { id: 'admin', role: 'admin', userId: 'admin' };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Admin authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
};
