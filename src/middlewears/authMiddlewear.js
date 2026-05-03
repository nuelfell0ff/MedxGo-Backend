import jwt from 'jsonwebtoken';
import User from '../model/User.js';

export const protect = async (req, res) => {
  try {
    let token;

    // check for token in header
    if (
      req.headers.authorization &&
      req.headers.authorzation.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split('')[1];
    }

    if (!token) {
      return res.status(400).json({ message: 'Not Authorized, no token' })
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from DB
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Not authorised'})
  }
};