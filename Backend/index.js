const express = require('express');
const { google } = require('googleapis');
// const fs = require('fs');
// const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;
app.use(cors());

// Read credentials from environment variable (commented for now)
// const credentials = JSON.parse(process.env.CHATBOT_CONFIG);

// Ensure the path to your credentials file is correct
// const credentialsPath = path.join(__dirname, '../../Downloads/chatbot.json');
// const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));


// const chat = process.env.chat;;
// console.log(credentials, 'crdentials ........iiiiiiiiiiiiiiiiiiiiiiii');
const spreadsheetId = process.env.FILE_ID1;


const chatJsonString = process.env.CHATBOT_CONFIG;
let chat;

try {
  chat = JSON.parse(chatJsonString);
} catch (error) {
  console.error('Error parsing CHATBOT_CONFIG JSON:', error);
  chat = {}; // Default to empty object or handle as needed
}

const credentials = chat;

// Check the parsed object
// console.log('Parsed chat object:', chat);
// console.log(spreadsheetId ,  'wwwwwwwwwwwwwwwwwwwwwwwwwwwww')

// Initialize GoogleAuth with credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Route to check server status
app.get('/api', (req, res) => {
  res.json({ message: "I am alive" });
  console.log('Server is running');
});

// Route to fetch data from Google Sheets and write to file
app.get('/', async (req, res) => {
  const range = 'A1:C9';
  
  if (!spreadsheetId) {
    console.error('No spreadsheet ID found in environment variables.');
    res.status(500).send('Spreadsheet ID is missing.');
    return;
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    // Destructure the response to get values
    const { values } = response.data;

    // Ensure there are values and at least one row (headers)
    if (!values || values.length < 2) {
      res.status(400).send('No data found or insufficient data.');
      return;
    }

    // Extract headers and data rows
    const [headers, ...rows] = values;

    // Transform rows into key-value pairs
    const data = rows.map(row => {
      const entry = {};
      headers.forEach((header, index) => {
        // Use the header as the key and the row value as the value
        entry[header] = row[index] || ''; // Handle missing values
      });

      // Add the empty string key for the country value
      if (headers.includes('Country') && row[headers.indexOf('Country')]) {
        entry[""] = row[headers.indexOf('Country')];
      }

      return entry;
    });

    // Write to file with timestamp
    // const dataFilePath = path.join(__dirname, 'data-history.txt');
    const timestamp = new Date().toString() ;
    // const fileContent = `Timestamp: ${timestamp}\nData: ${JSON.stringify(data, null, 2)}\n\n`;
    
    // fs.appendFileSync(dataFilePath, fileContent);

    res.json(data);
    console.log('hit sheet data')
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).send('Error fetching data', error);
  }
});



// Route to read history from file
// app.get('/rates-history', (req, res) => {
//   const dataFilePath = path.join(__dirname, 'data-history.txt');

//   fs.readFile(dataFilePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading file:', err);
//       res.status(500).send('Error reading data from file');
//       return;
//     }
//     res.send(data);
//   });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
