const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  console.log("Token received:", token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};

module.exports = authentication;
