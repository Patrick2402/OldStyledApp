const express = require("express");
const isAuthenticated = require("../middleware/auth");
const fs2 = require("fs").promises;
const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");
const mongoose = require("mongoose");
const router = express.Router();

const Schema = mongoose.Schema;
const scanSchema = new Schema({
  fileName: { type: String, required: true, unique: true },
  autor: { type: String, required: true },
  imageName: { type: String, required: true },
});
const Scan = mongoose.model("Scans", scanSchema);

const dataSchema = new Schema({
  fileName: { type: String, required: true },
  package: { type: String },
  installed: { type: String },
  fixed_in: { type: String },
  type: { type: String },
  cve: { type: String },
  severity: { type: String },
  imageName: { type: String}
});
const Data = mongoose.model("Data", dataSchema);

async function parseTableData(filePath, imageName, outputFileName) {
  try {
    const fileContent = await fs2.readFile(filePath, "utf-8");
    const lines = fileContent.trim().split("\n");
    const headers = lines[0].trim().split(/\s{2,}/);
    const dataLines = lines.slice(1);

    const data = dataLines
      .map((line, index) => {
        const columns = line.split(/\s{2,}/);

        const startsWithNumber = /^\d/.test(columns[2]);
        if (columns[2] !== "(won't fix)" && !startsWithNumber) {
          [columns[3], columns[4], columns[5]] = [
            columns[2],
            columns[3],
            columns[4],
          ];
          columns[2] = "-";
        }

        const row = headers.reduce((acc, header, idx) => {
          acc[header] = columns[idx];
          return acc;
        }, {});

        row.id = index + 1;
        return row;
      })
      .filter((row) => row.SEVERITY !== "Negligible");
    await Data.deleteMany({ outputFileName });

    const dataWithFileName = data.map((row, index) => ({
      fileName: outputFileName,
      package: row["NAME"],
      installed: row["INSTALLED"],
      fixed_in: row["FIXED-IN"],
      type: row["TYPE"],
      cve: row["VULNERABILITY"],
      severity: row["SEVERITY"],
      imageName: imageName
    }));

    await Data.insertMany(dataWithFileName);
    return data;
  } catch (error) {
    console.error("Error reading or parsing file:", error);
    throw error;
  }
}

router.get("/start-scan", isAuthenticated, (req, res) => {
  res.render("startScan", { title: "Start Scan" });
});

router.post("/start-scan", isAuthenticated, async (req, res) => {
  const imageName = req.body.imageName;
  const { username } = req.session.user;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  const outputFileName = `scan-${formattedDate}`;
  const filePath = path.join(__dirname, "../scans", outputFileName);

  const command = "docker";
  const args = ["run", "anchore/grype", imageName];

  console.log("Starting scan with command:", command, args);

  try {
    // Create a Promise to handle the completion of the Docker process
    await new Promise((resolve, reject) => {
      const proc = spawn(command, args);
      const writeStream = fs.createWriteStream(filePath);

      proc.stdout.pipe(writeStream);

      proc.on("close", (code) => {
        if (code === 0) {
          console.log(`Child process exited with code ${code}`);
          resolve(); 
        } else {
          reject(new Error(`Child process exited with code ${code}`));
        }
      });

      proc.on("error", (err) => {
        reject(err);
      });

      writeStream.on("finish", () => {
        console.log("File write completed.");
      });

      writeStream.on("error", (err) => {
        reject(err);
      });
    });
    const scan_results = await parseTableData(filePath, imageName, outputFileName);

    const newScan = new Scan({
      fileName: outputFileName,
      autor: username,
      imageName: imageName,
    });
    await newScan.save();

    res.render("startScan", { title: "Start Scan" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error processing scan");
  }
});

exports.router = router;
