// Import the Router
const router = require("express").Router();

// Import the Post model
const Post = require("../models/post");

// Add Comment 
router.post("/:id", (req, res) => {
  Post.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $push: {
      comments: {
        author: req.user.name,
        faculty: req.user.faculty,
        body: req.body.body,
      },
    },
  }, (err, post) => {
    if (err) throw err;
    res.redirect(`/posts/${post.year}/${post.month}/${post.day}/${post.slug}`)
  })
})

// Edit comment
router.get("/:id", (req, res) => {
  Post.findOne({"comment._id": req.params.id}, (err, comment) => {
    if (err) throw err;
    res.json({
      author: comment.author,
      body: comment.body,
    })
  })
})

// save the edited comment
router.post("/:id", (req, res) => {
  Post.findOneAndUpdate({"comments._id": req.params.id},
  {$set: {
    "comments.$.author": req.user.username,
     "comments.$.body": req.body.body,
    },
  }, (err, post) => {
    if (err) throw err;
    res.render("posts/post", {post: post});
  })
})

// Delete comment
router.post("/:id/delete", (req, res) => {
  Post.findOneAndUpdate({"comments._id": req.params.id},
{$pull: {
  "comments": {
    "_id": req.params.id,
  },
}}, (err, post) => {
  if (err) throw err;
  res.render("posts/post", {post: post});
})
})

// Export the router
module.exports = router;
