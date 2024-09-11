const express = require('express');
const isAuthenticated = require('../middleware/auth');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Konfiguracja AWS
const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const router = express.Router();

router.get('/start-scan', isAuthenticated, (req, res, next) => {
    res.render('startScan', { title: "Start Scan" });
});

router.post('/start-scan', isAuthenticated, async (req, res, next) => {
    const imageName = req.body.imageName;
    console.log(imageName);

    const filePath = path.join(__dirname, '../file.json');
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
        Bucket: 'securityscansgrype',
        Key: 'file.json',
        Body: fileStream,
        ContentType: 'application/json'
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        const data = await s3.send(command);
        console.log('File uploaded successfully. File location:', data.Location);
    } catch (err) {
        console.error('Error uploading file:', err);
    }

    res.render('startScan', { title: "Start Scan"});
});
exports.router = router;