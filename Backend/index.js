const express = require('express');
const { google } = require('googleapis');
// const path = require('path');
const fs = require('fs');
const cors = require('cors');  
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;
app.use(cors());  

// const chat = require('./chatbot')
// const credentials = JSON.parse(fs.readFileSync(process.env.CHATBOT_CONFIG));
// const credentials = chat
const credentials = process.env.chat



const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// https://docs.google.com/spreadsheets/d/1XJBnMQpz8uL7W_uT7MNq4xQUSVoqL-fZ/edit?usp=sharing&ouid=115003692913186980584&rtpof=true&sd=true
const sheets = google.sheets({ version: 'v4', auth });

app.get('/', async (req, res) => {
  res.json({ message: "I am alive" }); 
});

app.get('/api/sheetdata', async (req, res) => {
  const spreadsheetId = process.env.file_id; 
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
