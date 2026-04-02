import User from "../models/User.js";

//  поиск пользователей
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      username: { $regex: query, $options: "i" }
    }).select("username avatar bio");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};