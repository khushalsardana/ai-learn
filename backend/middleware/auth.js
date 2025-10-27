import jwt from 'jsonwebtoken';

// Authentication middleware
export const requireAuth = (req, res, next) => {
  // Debug logging
  console.log('=== AUTH CHECK ===');
  console.log('Authorization header:', req.headers.authorization);
  
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided');
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Please log in to access this resource' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'your-secret-key');
    
    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    console.log('✅ Token verified for user:', req.userId);
    console.log('==================');
    
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    console.log('==================');
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid or expired token' 
    });
  }
};

// Admin middleware
export const requireAdmin = (req, res, next) => {
  // requireAuth should be called first, so req.userId and req.userRole should be set
  if (!req.userId || !req.userRole) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Please log in to access this resource' 
    });
  }
  
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Admin access required' 
    });
  }
  
  next();
};
