import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Please authenticate",
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  next();
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superAdmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
};
