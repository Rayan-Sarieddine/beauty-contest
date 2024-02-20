const adminRoleMiddleware = async (req, res, next) => {
  const userType = req.user?.userType;

  if (!userType) {
    return res.status(401).send("Unauthorized");
  }

  if (userType !== "ADMIN") {
    return res.status(403).send("Forbidden: Insufficient permissions");
  }
  const user = req.user;
  req.user = user;
  next();
};

module.exports = {
  adminRoleMiddleware,
};
