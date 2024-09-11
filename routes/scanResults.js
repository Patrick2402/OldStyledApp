const express = require('express');
const isAuthenticated = require('../middleware/auth');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');

// Konfiguracja AWS S3
const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const router = express.Router();

// Funkcja pomocnicza do konwersji streamu na string
const streamToString = (stream) => 
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        stream.on('error', reject);
    });

    router.get('/scan-results', isAuthenticated, async (req, res, next) => {
        try {
            const params = {
                Bucket: 'securityscansgrype',
                Key: 'file.json'
            };
    
            const command = new GetObjectCommand(params);
            const data = await s3.send(command);
    
            // Odczyt pliku i parsowanie JSON
            const fileContent = await streamToString(data.Body);
            const jsonData = JSON.parse(fileContent);
    
            // Filtrowanie podatności z poziomem innym niż "Negligible"
            const vulnerabilities = jsonData.matches
                .filter(match => match.vulnerability.severity !== 'Negligible')
                .map(match => {
                    return {
                        name: match.artifact.name,
                        installed: match.artifact.version,
                        fixedIn: match.vulnerability.fix?.versions.join(', ') || '(wont fix)',
                        type: match.artifact.type,
                        vulnerability: match.vulnerability.id,
                        severity: match.vulnerability.severity
                    };
                });
    
            // Renderowanie widoku z danymi podatności
            res.render('scanResults', { 
                title: "Scan Results", 
                vulnerabilities
            });
        } catch (err) {
            console.error('Error fetching or parsing file:', err);
            res.render('scanResults', { 
                title: "Scan Results", 
                vulnerabilities: [],
                error: 'Error fetching scan results. Please try again later.'
            });
        }
    });

exports.router = router;