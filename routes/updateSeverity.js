const express = require('express');
const fs = require('fs');

router = express.Router();

router.use(express.json());


router.post('/update-severity/:id', (req, res) => {
    const { id } = req.params;
    const { severity } = req.params;
    console.log(id,req.body)
    fs.readFile('/Users/patryk.zawieja/Desktop/Application/OldStyledApp/scans/scan-2024-09-17-20-01-00.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file och');
        let jsonData = JSON.parse(data);
        console.log(jsonData);
        
        let vulnerability = jsonData.vulnerability.find(v => v.vulnerability.id === id);

        if (vulnerability) {
            vulnerability.severity = severity;

            fs.writeFile('/Users/patryk.zawieja/Desktop/Application/OldStyledApp/scans/scan-2024-09-17-20-01-00.json', JSON.stringify(jsonData, null, 4), 'utf8', (err) => {
                if (err) return res.status(500).send('Error saving file');
                res.json({ success: true });
            });
        } else {
            res.status(404).send('Vulnerability not found');
        }
    });
});

exports.router = router;