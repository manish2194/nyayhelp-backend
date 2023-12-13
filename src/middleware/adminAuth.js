// Check if user is admin or not

const authenticateAdmin = () => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "ADMIN") {
      return res.status(403).send("Forbidden");
    }
    next();
  };
};

module.exports = {
  authenticateAdmin,
};
