import jwt from 'jsonwebtoken';
import User from '../model/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. If no token
    if (!token) {
      return res.status(401).json({ message: "Not authorised, no token" });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    // 5. If user not found
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log("AUTH HEADER:", req.headers.authorization);
    
    // 6. Continue
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorised" });
  }
};