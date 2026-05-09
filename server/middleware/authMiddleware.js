const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

/**
 * Middleware to protect routes from unauthorized access.
 * Verifies the JWT sent in the Authorization header.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 * @param {import('express').NextFunction} next - The express next function.
 */
const protect = async (req, res, next) => {
  let token;

  // Search for the 'Authorization' header in the format: "Bearer <token>"
  // Standard method for passing JSON Web Tokens (JWT) in HTTP requests.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraction of the token from the "Bearer <token>" string.
      token = req.headers.authorization.split(' ')[1];

      // Verification of the token using the secret key. 
      // Expiration or tampering will cause jwt.verify to throw an error.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attachment of the user record (excluding the password) to the request object.
      // req.user becomes available to subsequent route handlers and controllers.
      req.user = await User.findById(decoded.id).select('-password');

      // Execution of next() to proceed to the route handler.
      next();
    } catch (error) {
      // 401 Unauthorized response stops the request cycle if verification fails.
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Handling cases where no token is provided in the headers.
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };