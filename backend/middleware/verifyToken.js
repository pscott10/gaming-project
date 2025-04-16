const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
