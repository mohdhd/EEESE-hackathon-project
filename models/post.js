const mongoose = require('mongoose')
const CommentSchema = require("./comment");

// Set the Post Schema
const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
  },
  comments: {
    type: [CommentSchema],
  },
  slug: {
    type: String,
  },
  url: String,
  year: Number,
  month: Number,
  day: Number,
})

// Export the Post model
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
