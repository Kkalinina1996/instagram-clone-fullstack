import User from "../models/User.js";


//  получить свой профиль
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  обновить профиль
export const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

