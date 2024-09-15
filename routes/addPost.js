const express = require("express");
const mongoose = require("mongoose");
const isAuthenticated = require("../middleware/auth");
const { isAuthed } = require("./login");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date },
  username: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Post = mongoose.model("Post", postSchema);

// main code
router = express.Router();

router.get("/addPost", isAuthenticated, (req, res, next) => {
  const isAuthed = req.session.user ? true : false;
  res.render("../views/addPost", { title: "Add Post", isAuthed: isAuthed });
});

router.post("/AddPost", (req, res, next) => {
  const date = new Date();
  console.log("Iam creating post requrest");

  newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    username: req.session.user.username,
    date: date,
  });

  newPost
    .save()
    .then((result) => {
      console.log("Post saved:", result);
      res.redirect("/posts"); // redirect to posts site
    })
    .catch((err) => {
      console.error("Error saving post:", err);
      res.status(500).send("Error saving post");
    });
});

router.put("/post/:id/like", isAuthenticated, (req, res, next) => {
  const userId = req.session.user._id;
  const postId = req.params.id;
  console.log("Post ID:", postId);
  console.log("User ID:", userId);

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).send("Post not found");
      }

      const likeIndex = post.likes.indexOf(userId);

      if (likeIndex === -1) {
        post.likes.push(userId);
      } else {
        post.likes.splice(likeIndex, 1);
      }

      return post.save();
    })
    .then((result) => {
      res.json({ likesCount: result.likes.length });
    })
    .catch((err) => {
      console.error("Error updating likes:", err);
      res.status(500).send("Error updating likes");
    });
});

exports.router = router;
