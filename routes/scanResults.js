const express = require('express');
const isAuthenticated = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

const Scan = mongoose.model('Scans');

const router = express.Router();

router.get('/scan-results/:fileName?', isAuthenticated, async (req, res, next) => {
    const { fileName } = req.params;

    try {
        let vulnerabilities = [];
        let imageName;
        if (fileName) {
            const filePath = path.join(__dirname, '../scans', fileName);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);
            vulnerabilities = jsonData.matches
                .filter(match => match.vulnerability.severity !== 'Negligible')
                .map(match => ({
                    name: match.artifact.name,
                    installed: match.artifact.version,
                    fixedIn: match.vulnerability.fix?.versions.join(', ') || '(won\'t fix)',
                    type: match.artifact.type,
                    vulnerability: match.vulnerability.id,
                    severity: match.vulnerability.severity
                }));

            
                const scan = await Scan.findOne({ fileName });
            if (scan) {
                imageName = scan.imageName;

            }
        } 

        const { username } = req.session.user;

        // showing only user scans 

        Scan.find({ autor: username })
            .then(myscan => {
                res.render('scanResults', { 
                    title: "Scan Results", 
                    vulnerabilities,
                    myscan,
                    imageName
                });
            })
            .catch(err => {
                console.error('Error fetching scans:', err);
                res.status(500).send('Error fetching scans');
            });
    } catch (err) {
        console.error('Error fetching or parsing file:', err);
        res.status(500).send('Error fetching scan results');
    }
});

exports.router = router;