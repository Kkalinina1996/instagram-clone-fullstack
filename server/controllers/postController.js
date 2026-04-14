import Post from "../models/Post.js";

// ✅ CREATE POST (САМОЕ ВАЖНОЕ)
export const createPost = async (req, res) => {
  try {
    const caption = req.body.caption;

    const post = await Post.create({
      author: req.user.userId,
      image: `/uploads/${req.file.filename}`, 
      caption,
    });

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET POSTS
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

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username avatar"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (typeof req.body.caption === "string") {
      post.caption = req.body.caption;
    }

    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "username avatar"
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete post 

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   //only admin can delete post 
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
