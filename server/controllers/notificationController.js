import Notification from "../models/Notification.js";


//  получить уведомления
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId
    })
      .populate("sender", "username avatar")
      .populate("post", "image")
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  отметить как прочитанные
export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.userId },
      { isRead: true }
    );

    res.json({ message: "All notifications read" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};