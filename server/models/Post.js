import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ""
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);