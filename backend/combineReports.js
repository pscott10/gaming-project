const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

router.get('/export', async (req, res) => {
    const {month, year} = req.query;
    const sql = `SELECT * FROM gaming_data WHERE Month = ? AND Year = ?`;

    db.all(sql, [month, year], async (err, rows) => {
        if(err) {
            return res.status(500).json({error: 'Database error'});
        }

        //write to CSV
        const filePath = path.join(__dirname, '..', 'data', `export_${month}_${year}.csv`);
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'Municipality', title: 'Municipality' },
                { id: 'Establishment', title: 'Establishment' },
                { id: 'VGTCount', title: 'VGTCount'},
                { id: 'AmountPlayed', title: 'AmountPlayed'},
                { id: 'AmountWon', title: 'AmountWon'},
                { id: 'NetWager', title: 'NetWager'},
                { id: 'FundsIn', title: 'FundsIn'},
                { id: 'FundsOut', title: 'FundsOut'},
                { id: 'NetTerminalIncome', title: 'NetTerminalIncome'},
                { id: 'NTITax', title: 'NTITax'},
                { id: 'StateShare', title: 'StateShare'},
                { id: 'MunicipalityShare', title: 'MunicipalityShare'},
                { id: 'Month', title: 'Month' },
                { id: 'Year', title: 'Year' },
            ],
        });
        
        try {
            await csvWriter.writeRecords(rows);
            res.download(filePath, (downloadErr) => {
                if(downloadErr){
                    console.error(downloadErr);
                }
            });
        } catch (writeErr){
            console.error(writeErr);
            res.status(500).json({error: 'Error generating CSV'});
        }
    });
});
