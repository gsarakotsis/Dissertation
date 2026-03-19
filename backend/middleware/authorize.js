const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized for this action`
      });
    }
    next();
  };
};

const requireEventPlanner = (req, res, next) => {
  if (!req.user.eventPlanner && req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Event Planner privileges required to create events'
    });
  }
  next();
};

module.exports = { authorize, requireEventPlanner };