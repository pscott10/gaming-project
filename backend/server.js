//set up express server

require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(passport.initialize());

require('./config/passport');


app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


const { createObjectCsvWriter } = require('csv-writer');


async function exportToCsv(rows, filePath) {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'Municipality', title: 'Municipality' },
      { id: 'Establishment', title: 'Establishment' },
      { id: 'LicenseNumber', title: 'License Number' },
      { id: 'VGTCount', title: 'VGT Count' },
      { id: 'AmountPlayed', title: 'Amount Played' },
      { id: 'AmountWon', title: 'Amount Won' },
      { id: 'NetWager', title: 'Net Wager' },
      { id: 'FundsIn', title: 'Funds In' },
      { id: 'FundsOut', title: 'Funds Out' },
      { id: 'NetTerminalIncome', title: 'Net Terminal Income' },
      { id: 'NTITax', title: 'NTI Tax' },
      { id: 'StateShare', title: 'State Share' },
      { id: 'MunicipalityShare', title: 'Municipality Share' },
      { id: 'Month', title: 'Month' },
      { id: 'Year', title: 'Year' },
    ],
  });

  await csvWriter.writeRecords(rows);
  return filePath;
}

module.exports = { exportToCsv };