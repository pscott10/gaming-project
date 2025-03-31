const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../database/db');
const math = require('mathjs');

//configure Multer to store uploads in a temp folder
const upload = multer({
    dest: path.join(__dirname, '..', 'uploads'),
});

//POST /api/reports/upload
router.post('/upload', upload.single('file'), (req, res) => {
    //user must provide month and year
    const {month, year} = req.body;
    if (!month || !year){
        if(req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({error: 'Month and year must be provided'});
    }

    if(!req.file){
        return res.status(400).json({error: 'No file uploaded'});
    }

    //Validate file extension
    if(path.extname(req.file.originalname).toLowerCase() !== '.csv'){
        fs.unlinkSync(req.file.path);
        return res.status(400).json({error: 'Only CSV files are allowed'});
    }

    // Check if the report for this month and year already exists
    const checkSql = "SELECT COUNT(*) AS count FROM gaming_data WHERE Month = ? AND Year = ?";
    db.get(checkSql, [month, year], (err, row) => {
      if (err) {
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: 'Database error during duplicate check' });
      }
      
      if (row.count > 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: `Report for ${month} ${year} already exists` });
      }
  
      // If no duplicates, proceed with processing the CSV
      const results = [];
      fs.createReadStream(req.file.path)
        .pipe(csv({ skipLines: 3 }))
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            const stmt = db.prepare(`
              INSERT INTO gaming_data (
                Municipality,
                Establishment,
                LicenseNumber,
                VGTCount,
                AmountPlayed,
                AmountWon,
                NetWager,
                FundsIn,
                FundsOut,
                NetTerminalIncome,
                NTITax,
                StateShare,
                MunicipalityShare,
                Month,
                Year
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
  
            try {
              results.forEach((r) => {
                const vgtCount = parseInt(r['VGT Count']) || 0;
                const amountPlayed = parseFloat(r['Amount Played']) || 0;
                const amountWon = parseFloat(r['Amount Won']) || 0;
                const netWager = parseFloat(r['Net Wager']) || 0;
                const fundsIn = parseFloat(r['Funds In']) || 0;
                const fundsOut = parseFloat(r['Funds Out']) || 0;
                const netTerminalIncome = parseFloat(r['Net Terminal Income']) || 0;
                const ntiTax = parseFloat(r['NTI Tax']) || 0;
                const stateShare = parseFloat(r['State Share']) || 0;
                const municipalityShare = parseFloat(r['Municipality Share']) || 0;
  
                stmt.run(
                  r['Municipality'] || '',
                  r['Establishment'] || '',
                  r['License Number'] || '',
                  vgtCount,
                  amountPlayed,
                  amountWon,
                  netWager,
                  fundsIn,
                  fundsOut,
                  netTerminalIncome,
                  ntiTax,
                  stateShare,
                  municipalityShare,
                  month,
                  parseInt(year)
                );
              });
              stmt.finalize();
              db.run('COMMIT', () => {
                fs.unlinkSync(req.file.path);
                return res.json({ message: `Successfully uploaded ${results.length} rows` });
              });
            } catch (err) {
              db.run('ROLLBACK');
              fs.unlinkSync(req.file.path);
              return res.status(500).json({ error: 'Error inserting data' });
            }
          });
        })
        .on('error', (err) => {
          fs.unlinkSync(req.file.path);
          return res.status(500).json({ error: 'Error reading CSV file' });
        });
    });
  });

  //POST /api/reports/comphrehensive
  router.post('/comprehensive', (req, res) => {
    const { filters, customColumns, title } = req.body;
    if (!filters || !title){
        return res.status(400).json({error: 'Filters and title are required'});
    }

    let conditions = [];
    let params = [];

    if(filters.month){
        let months = typeof filters.month === 'string' ? filters.month.split(',').map(m => m.trim()) : filters.month;
        if (months.length === 1){
            conditions.push("Month = ?");
            params.push(months[0]);
        } else if (months.length > 1){
            let placeholders = month.map(() => '?').join(',');
            conditions.push(`Month IN (${placeholders})`);
            params.push(...months);
        }
    }

    if(filters.year){
        let years = typeof filters.year === 'string' ? filters.year.split(',').map(y => y.trim()) : filters.year;
        if (years.length === 1){
            conditions.push("Year =?");
            params.push(years[0]);
        } else if (years.length > 1){
            let placeholders = years.map(() => '?').join(',');
            conditions.push(`Year IN (${placeholders})`);
            params.push(...years);
        }
    }

    if (filters.municipalities){
        let munis = typeof filters.municipalities === 'string' ? filters.municipalities.split(',').map(s=>s.trim())
            : filters.municipalities;
        let placeholders = munis.map(() => '?').join(',');
        conditions.push(`Municipality IN (${placeholders})`);
        params.push(...munis);
    }

    if(filters.establishments){
        let ests = typeof filters.establishments === 'string' ? filters.establishments.split(',').map(s=>s.trim())
            : filters.establishments;
        let placeholders = ests.map(() => '?').join(',');
        conditions.push(`Establishment IN (${placeholders})`);
        params.push(...ests);
    }

    let sql = "SELECT * FROM gaming_data";
    if (conditions.length > 0){
        sql += " WHERE " + conditions.join(" AND ");
    }

    //execute query to fetch matching rows
    db.all(sql, params, (err, rows) => {
        if(err) {
            console.error(err);
            return res.status(500).json({error: 'Database error while fetching data'});
        }
        //apply custom calcs
        if (customColumns && Array.isArray(customColumns)){
            rows = rows.map(row => {
                customColumns.forEach(col => {
                    try {
                        const result = math.evaluate(col.formula, row);
                        row[col.columnName] = result;
                    } catch (e) {
                        row[col.columnName] = null;
                    }
                });
                return row;
            });
        }
        const reportData = JSON.stringify(rows);
        const filtersJSON = JSON.stringify(filters);
        const customColumnsJSON = JSON.stringify(customColumns || []);

        const insertSql = `
            INSERT INTO comprehensive_reports (
                user_id,
                title,
                filters,
                custom_columns,
                data
            ) VALUES (?, ?, ?, ?, ?)
        `;

        //user_id is null!!!!
        db.run(insertSql, [null, title, filtersJSON, customColumnsJSON, reportData], function(insertErr) {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({error: 'Error saving comprehensive report' });
            }
            return res.json({
                message: 'Comphrehensive report created successfully',
                reportID: this.lastID,
                data: rows
            });
        });
    });
});

/**GET /api/reports/history
 * Lists ALL comprehensive reports for logged in user
 */
router.get('/history', (req, res) => {
    const sql = "SELECT id, title, filters, custom_columns, createAt FROM comprehensive_reports ORDER BY createdAt DESC";
    db.all(sql, [], (err, rows) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while retrieving report history'});
        }
        res.json(rows);
    });
});

/**GET /api/reports/history/:id
 * Returns a specific comprehensive report by ID
 */
router.get('/history/:id', (req, res) => {
    const sql = "SELECT * FROM comprehensive_reports WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Database error while retrieving the report'});
        }
        if (!row){
            return res.status(404).json({error: 'Report not found'});
        }
        res.json(row);
    });
});

module.exports = router;
