// Check if user is admin or not

const authenticateAdmin = () => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "Access Denied" });
    }
    next();
  };
};

module.exports = {
  authenticateAdmin,
};
