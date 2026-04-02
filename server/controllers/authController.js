import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Проверка: все поля есть?
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Проверка: пользователь уже есть?
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Создаём пользователя
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // 5. Создаём токен (сразу логиним)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Проверка
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Найти пользователя
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 3. Проверить пароль
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 4. Токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};