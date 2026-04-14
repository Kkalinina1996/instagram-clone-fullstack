import Post from "../models/Post.js";
import Notification from "../models/Notification.js";


export const toggleLike = async (req, res) => {
  
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);

      if (post.author.toString() !== userId) {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();

    res.json({
      message: isLiked ? "Like removed" : "Liked",
      likesCount: post.likes.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
