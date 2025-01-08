const jwt = require('jsonwebtoken');
// const jwtSecret = process.env.JWT_ADMIN_SECRET;

const AdminAuth = (req, res, next) => {

const payload = {
  id: 'admin123', // For example, the admin ID
  role: 'admin'   // Or any other claim like role
};

// Use the same secret from your environment variables or hard-code it for testing
const jwtSecret = process.env.JWT_ADMIN_SECRET || 'your_default_secret_key';

// Generate the token
const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // Token expires in 1 hour

// console.log('Generated Token:', token);


  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {

    const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
  } catch (err) {
    // Token verification failed
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Export the middleware function
module.exports = AdminAuth;