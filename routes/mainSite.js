const path = require("path");
const express = require("express");
const routers = express.Router();

routers.get("/", (req, res, next) => {
  const isAuthed = req.session.user ? true : false;
  res.render("../views/main", { title: "Main Site", isAuthed: isAuthed });
});

module.exports = routers;
