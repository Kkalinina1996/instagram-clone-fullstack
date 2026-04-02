import Comment from "../models/Comment.js";


// ➕ создать комментарий
export const addComment = async (req, res) => {
  
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user.userId,
      text
    });

    res.status(201).json(comment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  получить комментарии
export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};