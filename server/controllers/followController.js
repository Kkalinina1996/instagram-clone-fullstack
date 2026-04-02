import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const user = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      user.following = user.following.filter(
        id => id.toString() !== targetUserId
      );

      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUserId
      );
    } else {
      user.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        type: "follow"
      });
    }

    await user.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? "Unfollowed" : "Followed"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};