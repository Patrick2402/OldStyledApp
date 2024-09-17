const fs = require('fs').promises;
const path = require('path');

async function parseTableData() {
  try {
    console.log('Parse Table')
    const filePath = path.join(__dirname,'../scans', 'x.txt');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const lines = fileContent.trim().split('\n');
    
    const headers = lines[0].trim().split(/\s{2,}/); 
    const dataLines = lines.slice(1);
    
    const data = dataLines.map(line => {
      const values = line.trim().split(/\s{2,}/); 
      return headers.reduce((acc, header, index) => {
        acc[header] = values[index];
        return acc;
      }, {});
    });
    
    return data;
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    throw error;
  }
}