import Post from "../models/Post.js";


// ✅ создать пост
export const createPost = async (req, res) => {
  try {
    const { image, caption } = req.body;

    const post = await Post.create({
      author: req.user.userId,
      image,
      caption
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ получить все посты (feed)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};