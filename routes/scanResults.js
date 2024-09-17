const express = require("express");
const isAuthenticated = require("../middleware/auth");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");

const router = express.Router();
const Data = mongoose.model("Data");
const Scan = mongoose.model("Scans");

router.get(
  "/scan-results/:fileName?",
  isAuthenticated,
  async (req, res, next) => {
    const { username } = req.session.user;
    const fileName = req.params.fileName;
    console.log("Filename:", fileName);
    const data = await Data.find({ fileName: fileName });
    console.log("Data:", data);

    const scan = await Scan.findOne({ fileName });
    if (scan) {
      imageName = scan.imageName;
    }
    if (data.length === 0) {
        imageName = '';
    }

    Scan.find({ autor: username })
      .then((myscan) => {
        res.render("textTable", {
          title: "Scan Results",
          data: data,
          myscan,
          imageName: imageName,
        });
      })
      .catch((err) => {
        console.error("Error fetching scans:", err);
        res.status(500).send("Error fetching scans");
      });
  }
);

exports.router = router;
