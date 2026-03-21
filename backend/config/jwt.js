const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET + '_refresh', {
    expiresIn: '30d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateEmailToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET + '_email', {
    expiresIn: '24h'
  });
};

const generateResetToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET + '_reset', {
    expiresIn: '1h'
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateEmailToken,
  generateResetToken
};
