const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Login karein pehle'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User nahi mila'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account deactivated hai'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

exports.adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

exports.planCheck = (requiredPlan) => {
  const planHierarchy = { free: 0, starter: 1, pro: 2, enterprise: 3 };
  return (req, res, next) => {
    const userPlanLevel = planHierarchy[req.user.plan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;
    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        success: false,
        message: `Yeh feature ${requiredPlan} plan mein available hai`,
        upgradeRequired: true,
        requiredPlan
      });
    }
    if (!req.user.isPlanActive()) {
      return res.status(403).json({
        success: false,
        message: 'Plan expire ho gaya hai, renew karein',
        upgradeRequired: true
      });
    }
    next();
  };
};
