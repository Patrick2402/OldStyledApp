const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const routeLogin = require("./routes/login");
const mainSite = require("./routes/mainSite");
const addPost = require("./routes/addPost");
const routeRegister = require("./routes/register");
const posts = require("./routes/posts");
const routerLogout = require("./routes/logout");
const profile = require("./routes/profile");
const resetPassword = require("./routes/changePassword");
const pass = require("./mongopasswords");
const securityHeaders = require("./middleware/securityHeaders");
const startScan = require("./routes/startScan");
const scanResults = require("./routes/scanResults");
const updateSeverity = require('./routes/updateSeverity');

const app = express();

app.use(
  session({
    secret: "gfjkdlguihfbwd",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(updateSeverity.router);
app.use(securityHeaders);
app.use(scanResults.router);
app.use(startScan.router);
app.use(resetPassword.router);
app.use(profile.router);
app.use(posts.router);
app.use(routeRegister.router);
app.use(addPost.router);
app.use(routeLogin.routes);
app.use(routerLogout);
app.use(mainSite);

mongoose
  .connect(pass)
  .then((result) => {
    console.log('connection establised')
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
