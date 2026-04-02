import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1. Получаем header
    const authHeader = req.headers.authorization;

    // 2. Проверяем есть ли он
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 3. Проверяем формат "Bearer TOKEN"
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ message: "Token error" });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer") {
      return res.status(401).json({ message: "Token malformatted" });
    }

    // 4. Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Кладём user в request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;