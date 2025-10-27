// Authentication middleware
export const requireAuth = (req, res, next) => {
  // Debug logging
  console.log('=== AUTH CHECK ===');
  console.log('Has session:', !!req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Session userId:', req.session?.userId);
  console.log('Cookies:', req.headers.cookie);
  console.log('==================');
  
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Please log in to access this resource' 
    });
  }
  next();
};

// Admin middleware
export const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Please log in to access this resource' 
    });
  }
  
  if (req.session.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Admin access required' 
    });
  }
  
  next();
};
