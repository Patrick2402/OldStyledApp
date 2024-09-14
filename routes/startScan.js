const express = require('express');
const isAuthenticated = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const mongoose = require('mongoose');
const router = express.Router();



const Schema = mongoose.Schema;
const scanSchema = new Schema({
    fileName: { type: String, required: true, unique: true},
    autor: { type: String, required: true },
    imageName: { type: String, required: true}
});
const Scan = mongoose.model('Scans', scanSchema);


router.get('/start-scan', isAuthenticated, (req, res) => {
    res.render('startScan', { title: "Start Scan" });
});

router.post('/start-scan', isAuthenticated, async (req, res) => {
    const imageName = req.body.imageName; 
    const { username } = req.session.user;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    const outputFileName = `scan-${formattedDate}`;


    const filePath = path.join(__dirname, '../scans' ,outputFileName);

    const command = 'docker';
    const args = [
        'run', 
        'anchore/grype', 
        imageName, 
        '--output', 
        'json',
    ];

    console.log('Starting scan with command:', command, args);
    try {

    const proc = spawn('docker',args);
    const writeStram = fs.createWriteStream(filePath);
    proc.stdout.pipe(writeStram);
    proc.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });

    const newScan = new Scan({
        fileName: outputFileName,
        autor: username,
        imageName: imageName
    });
    await newScan.save(); 

    } catch (err) {
        console.log('Mongo Scan Add', err)
    }

   


    
    res.render('startScan', { title: "Start Scan" });
});

exports.router = router;