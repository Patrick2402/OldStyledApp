const express = require("express");
const mongoose = require("mongoose");
const isAuthenticated = require("../middleware/auth");

const Posts = mongoose.model("Post");
router = express.Router();

router.get("/profile", isAuthenticated, (req, res, next) => {
  const isAuthed = req.session.user ? true : false;
  const { username } = req.session.user;

  Posts.find({ username: username })
    .then((myPosts) => {
      res.render("profile", {
        title: "Profile",
        username: username,
        isAuthed: isAuthed,
        myPosts: myPosts,
      });
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
      res.status(500).send("Error fetching posts");
    });
});

exports.router = router;
