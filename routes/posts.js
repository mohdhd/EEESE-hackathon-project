// Import the router 
const router = require("express").Router();

// Import Slugify for urls
const slugify = require("slugify");

// Import the Post model
const Post = require("../models/post");

// Index Route
router.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) throw err;
    res.render("posts", {
      posts: posts,
    })
  })
})

// Route for adding new posts
router.get("/create", authStudent, (req, res) => {
  res.render("create_post");
})

// Process the added post
router.post("/create", authStudent, (req, res) => {
  req.checkBody("title", "The Title is required").notEmpty();
  req.checkBody("body", "The body is required").notEmpty();

  // get errors if any
  let errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("create_post", {
      errors: errors,
    });
  } else {
    let post = new Post();

    // Fill the new post record
    post.title = req.body.title;
    post.author = req.user;
    post.body = req.body.body;
    post.slug = slugify(post.title.slice(0, 50));
    const date = new Date();
    post.year = date.getFullYear();
    post.month = date.getMonth() + 1;
    post.day = date.getDate();
    post.url = `${post.year}/${post.month}/${post.day}/${post.slug}/`;


    post.save(err => {
      if (err) throw err;
      else {
        // req.flash("success", "Post created");
        res.redirect("/posts");
      }
    })
  }
})

// Load Edit Form
router.get("/edit/:year/:month/:day/:slug", (req, res) => {
  let query = {
    year: req.params.year,
    month: req.params.month,
    day: req.params.day,
    slug: req.params.slug,
  };
  Post.findOne(query, (err, post) => {
    if (err) throw err;
    if (req.user.id === post.author._id) {
      res.render("posts/edit", {
        author: post.author,
        post: post,
      })
    } else {
      res.render("post", {
        author: post.author,
        post: post,
      })
    }
  })
})

// Process Edit form
router.post("/edit/:year/:month/:day/:slug", (req, res) => {
    let post = {};
  post.title = req.body.title;
  post.author = post.author;
  post.body = req.body.body;

  if (req.user.id === post.author._id) {
  let query = {
    year: req.params.year,
    month: req.params.month,
    day: req.params.day,
    slug: req.params.slug,
  };
  Post.update(query, post, err => {
    if (err) throw err;
    // req.flash("success", "Post Updated");
    res.redirect(`/posts/${query.year}/${query.month}/${query.day}/${query.slug}`);
  })} else {
    res.render("posts/post", {
      author: post.author,
      post: post,
    })
  }
})

// Delete Post
router.post("/delete/:id", (req, res) => {
  let query = {
    _id: req.params.id,
  };
  Post.findByIdAndRemove(query, (err, post) => {
    if (req.user.id === post.author._id) {
    if (err) res.render("post", {
      post: post,
    });
    // req.flash("danger", "There was an error deleting the post");
    // req.flash("success", "The post was deleted successfully");
    res.redirect("/posts");
  } else {
    res.redirect("/posts");
  }})
})


// Get post
router.get("/:year/:month/:day/:slug", (req, res) => {
  let query = {
    year: req.params.year,
    month: req.params.month,
    day: req.params.day,
    slug: req.params.slug,
  };
  Post.findOne(query, (err, post) => {
    console.log(post);
    if (err) throw err;
    res.render("post", {
      author: post.author,
      post: post,
    })
  })
})

// Export the router
module.exports = router;
