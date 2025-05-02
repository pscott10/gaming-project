const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//path to SQL db file
const dbPath = path.join(__dirname, 'gaming-edge.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if(err){
        console.error('Error opening SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS gaming_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Municipality TEXT,
      Establishment TEXT,
      LicenseNumber TEXT,
      VGTCount INTEGER,
      AmountPlayed REAL,
      AmountWon REAL,
      NetWager REAL,
      FundsIn REAL,
      FundsOut REAL,
      NetTerminalIncome REAL,
      NTITax REAL,
      StateShare REAL,
      MunicipalityShare REAL,
      Month TEXT,
      Year INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      googleId TEXT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS comprehensive_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        filters TEXT, 
        custom_columns TEXT,
        data TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

  module.exports = db;