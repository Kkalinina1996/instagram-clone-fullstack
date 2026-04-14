import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("BODY:", req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const usernameClean = username.trim();
    const emailClean = email.trim();

    const userByUsername = await User.findOne({ username: usernameClean });
    if (userByUsername) {
      return res.status(400).json({
        message: "This username is already taken",
      });
    }

    const userByEmail = await User.findOne({ email: emailClean });
    if (userByEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: usernameClean,
      email: emailClean,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id },
      "secret123",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created",
      token,
    });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "secret123",
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};