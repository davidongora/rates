const express = require('express');
const { google } = require('googleapis');
// const path = require('path');
const fs = require('fs');
const cors = require('cors');  

const app = express();
const port = 3000;
app.use(cors());  


const credentials = JSON.parse(fs.readFileSync('./chatbot-1b12b-2d83e0733efc.json'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// https://docs.google.com/spreadsheets/d/1XJBnMQpz8uL7W_uT7MNq4xQUSVoqL-fZ/edit?usp=sharing&ouid=115003692913186980584&rtpof=true&sd=true
const sheets = google.sheets({ version: 'v4', auth });

app.get('/api/sheetdata', async (req, res) => {
  const spreadsheetId = '18FGO3ML8HPc3B-B8bOmCeZklNoh-4jws9KfDKR7Awno'; 
  const range = 'A1:C12'; 
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    res.json(rows);
    console.table(rows)
    console.log('request initiated')
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
