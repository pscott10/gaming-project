const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../database/db');
const math = require('mathjs');
const verifyToken = require('../middleware/verifyToken');

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
                const vgtCount = parseInt(r['VGTCount']) || 0;
                const amountPlayed = parseFloat(r['AmountPlayed']) || 0;
                const amountWon = parseFloat(r['AmountWon']) || 0;
                const netWager = parseFloat(r['NetWager']) || 0;
                const fundsIn = parseFloat(r['FundsIn']) || 0;
                const fundsOut = parseFloat(r['FundsOut']) || 0;
                const netTerminalIncome = parseFloat(r['NetTerminal Income']) || 0;
                const ntiTax = parseFloat(r['NTITax']) || 0;
                const stateShare = parseFloat(r['StateShare']) || 0;
                const municipalityShare = parseFloat(r['Municipality Share']) || 0;
  
                stmt.run(
                  r['Municipality'] || '',
                  r['Establishment'] || '',
                  r['LicenseNumber'] || '',
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
  router.post('/comprehensive', verifyToken, (req, res) => {
    const userId = req.user.id;
    const { filters, customColumns, title } = req.body;
    if (!filters || !title){
        return res.status(400).json({error: 'Filters and title are required'});
    }

    let monthsArray = [];
    if (typeof filters.month === 'string') {
        monthsArray = filters.month.split(',').map(m => m.trim());
    } else if (Array.isArray(filters.month)) {
        monthsArray = filters.month;
    }

    const yearValue = filters.year;
    let conditions = [];
    let params = [];

    if (monthsArray.length > 0) {
        if (monthsArray.length === 1) {
          conditions.push("Month = ?");
          params.push(monthsArray[0]);
        } else {
          const placeholders = monthsArray.map(() => '?').join(',');
          conditions.push(`Month IN (${placeholders})`);
          params.push(...monthsArray);
        }
      }
    
      if (yearValue) {
        conditions.push("Year = ?");
        params.push(yearValue);
      }

      if (filters.municipalities) {
        let munis = typeof filters.municipalities === 'string'
          ? filters.municipalities.split(',').map(s => s.trim())
          : filters.municipalities;
        if (munis.length > 0) {
          const placeholders = munis.map(() => '?').join(',');
          conditions.push(`Municipality IN (${placeholders})`);
          params.push(...munis);
        }
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

        // Define a month order mapping so we can compare months numerically.
        const monthOrder = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12
        };

        //console.log("Raw rows:", rows);
        //group by license number to sum
        const grouped = {};
        rows.forEach(row => {
          const license = row['LicenseNumber'] ? row['LicenseNumber'].trim() : '';
          const currentMonthStr = row['Month'] ? row['Month'].trim() : '';
          if (!grouped[license]) {
            grouped[license] = { ...row };
            // Initialize minMonth and maxMonth as the current row's month
            grouped[license].minMonth = currentMonthStr;
            grouped[license].maxMonth = currentMonthStr;
          } else {
            // Sum numeric fields
            grouped[license]['VGTCount'] = (parseFloat(grouped[license]['VGTCount']) || 0) + (parseFloat(row['VGTCount']) || 0);
            grouped[license]['AmountPlayed'] = (parseFloat(grouped[license]['AmountPlayed']) || 0) + (parseFloat(row['AmountPlayed']) || 0);
            grouped[license]['AmountWon'] = (parseFloat(grouped[license]['AmountWon']) || 0) + (parseFloat(row['AmountWon']) || 0);
            grouped[license]['NetWager'] = (parseFloat(grouped[license]['NetWager']) || 0) + (parseFloat(row['NetWager']) || 0);
            grouped[license]['FundsIn'] = (parseFloat(grouped[license]['FundsIn']) || 0) + (parseFloat(row['FundsIn']) || 0);
            grouped[license]['FundsOut'] = (parseFloat(grouped[license]['FundsOut']) || 0) + (parseFloat(row['FundsOut']) || 0);
            grouped[license]['NetTerminalIncome'] = (parseFloat(grouped[license]['NetTerminalIncome']) || 0) + (parseFloat(row['NetTerminalIncome']) || 0);
            grouped[license]['NTITax'] = (parseFloat(grouped[license]['NTITax']) || 0) + (parseFloat(row['NTITax']) || 0);
            grouped[license]['StateShare'] = (parseFloat(grouped[license]['StateShare']) || 0) + (parseFloat(row['StateShare']) || 0);
            grouped[license]['MunicipalityShare'] = (parseFloat(grouped[license]['MunicipalityShare']) || 0) + (parseFloat(row['MunicipalityShare']) || 0);
      
            // Update the month range
            const currentMonthValue = monthOrder[currentMonthStr] || 0;
            const minMonthValue = monthOrder[grouped[license].minMonth.trim()] || Infinity;
            const maxMonthValue = monthOrder[grouped[license].maxMonth.trim()] || -Infinity;
      
            if (currentMonthValue < minMonthValue) {
              grouped[license].minMonth = currentMonthStr;
            }
            if (currentMonthValue > maxMonthValue) {
              grouped[license].maxMonth = currentMonthStr;
            }
          }
        });

        Object.keys(grouped).forEach(key => {
          const minMonth = grouped[key].minMonth.trim();
          const maxMonth = grouped[key].maxMonth.trim();
          grouped[key]['Month'] = 
            (minMonth === maxMonth) ? minMonth : `${minMonth} : ${maxMonth}`;
          delete grouped[key].minMonth;
          delete grouped[key].maxMonth;
        });

        //convert to array of aggregated rows
        const aggregatedRows = Object.values(grouped);

        //apply custom calcs
        const reportData = JSON.stringify(aggregatedRows);
        const filtersJSON = JSON.stringify(filters);
        const customColumnsJSON = JSON.stringify(customColumns || []);

        const insertSql = `
            INSERT INTO comprehensive_reports (
                user_id,
                title,
                filters,
                custom_columns,
                hidden_columns,
                notes,
                data
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertSql, [userId, title, filtersJSON, customColumnsJSON, JSON.stringify([]), "",reportData], function(insertErr) {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({error: 'Error saving comprehensive report' });
            }
            return res.json({
              message: 'Comprehensive report created successfully',
              reportID: this.lastID,
                data: aggregatedRows
            });
        });
    });
});

/**GET /api/reports/history
 * Lists ALL comprehensive reports for logged in user
 */
router.get('/history', verifyToken, (req, res) => {
    const sql = `
      SELECT id, title, filters, custom_columns, hidden_columns, createdAt, starred
      FROM comprehensive_reports
      WHERE user_id = ? 
      ORDER BY createdAt DESC
      `;
    db.all(sql, [req.user.id], (err, rows) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while retrieving report history'});
        }
        res.json(rows);
    });
});

//GET /api/reports/starred
router.get("/starred", verifyToken, (req, res) => {
  const sql = `
    SELECT id, title, filters, custom_columns, createdAt, starred
    FROM comprehensive_reports
    WHERE user_id = ? AND starred = 1
    ORDER BY createdAt DESC
  `;
  db.all(sql, [req.user.id], (err, rows) => {
    if(err) {
      console.error(err);
      return res.status(500).json({error: "Database error"});
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

//GET /api/municipalities
router.get("/municipalities", verifyToken, (req, res) => {
  const sql = `
    SELECT DISTINCT Municipality 
      FROM gaming_data 
    ORDER BY Municipality
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("DB error fetching municipalities:", err);
      return res.status(500).json({ error: "Database error" });
    }
    const list = rows.map((r) => r.Municipality);
    res.json(list);
  });
});

//patch to unstar/star reports
router.patch('/:id/star', verifyToken, (req, res) => {
  const reportId = req.params.id;
  const {starred} = req.body;
  const val = starred ? 1 : 0;

  const sql = `
    UPDATE comprehensive_reports
    SET starred = ?
    WHERE id = ? AND user_id = ?
    `;
    db.run(sql, [val, reportId, req.user.id], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({error: 'Error updating star status' });
      }
      if (this.changes === 0) {
        return res.status(404).json({error: 'Report not found'});
      }
      res.json({message: 'Star updated', starred});
    });
});

//patch for hidden reports
router.patch('/:id/hidden', verifyToken, (req, res) => {
  const reportId = req.params.id;
  const hiddenJSON = JSON.stringify(req.body.hiddenColumns || []);
  const sql = `
    UPDATE comprehensive_reports
      SET hidden_columns = ?
    WHERE id = ? AND user_id = ?
  `;
  db.run(sql, [hiddenJSON, reportId, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'DB error updating hidden columns' });
    if (this.changes === 0) return res.status(404).json({ error: 'Report not found' });
    res.json({ hiddenColumns: req.body.hiddenColumns });
  });
});

//patch to update notes
router.patch('/:id/notes', verifyToken, (req, res) => {
  const reportId = req.params.id;
  const {notes} = req.body;
  const sql = `
    UPDATE comprehensive_reports
      SET notes = ?
    WHERE id = ? AND user_id = ?
  `;
  db.run(sql, [notes, reportId, req.user.id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not save notes' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Notes saved', notes });
  });
});

// patch for custom_columns
router.patch(
  '/:id/custom-columns',
  verifyToken,
  (req, res) => {
    const reportId = req.params.id;
    const { customColumns } = req.body;
    const json = JSON.stringify(customColumns || []);
    const sql = `
      UPDATE comprehensive_reports
      SET custom_columns = ?
      WHERE id = ? AND user_id = ?
    `;
    db.run(sql, [json, reportId, req.user.id], function(err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (this.changes === 0)
        return res.status(404).json({ error: 'Report not found' });
      res.json({ message: 'Custom columns updated' });
    });
  }
);


module.exports = router;
