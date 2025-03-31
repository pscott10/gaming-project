const db = require('../database/db');

function getMunicipalitySummary(req, res){
    const{month, year} = req.query;
    const sql = `
        SELECT 
            Municipality,
            SUM(NetTerminalIncome) AS totalNTI,
            SUM(AmountPlayed) AS totalPlayed,
            SUM(AmountWon) AS totalWon,
            COUNT(*) AS recordCount
        FROM gaming_data
        WHERE Month = ? AND Year = ?
        GROUP BY Municipality
        ORDER BY totalNTI DESC
    `;

    db.all(sql, [month, year], (err, rows) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(rows);
    });
}

module.exports = {
    getMunicipalitySummary,
};
