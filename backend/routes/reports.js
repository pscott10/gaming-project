const express = require('express');
const processReports = require('../combineReports');
const router = express.Router();

router.post('/combine', async (req, res) => {
    const inputFiles = ['./data/AdamsVGRevenueReport.csv', './data/AltamontVGRevenueReport.csv'];
    const outputFile = './data/combined_report.csv';

    try {
        await processReports(inputFiles, outputFile);
        res.json({ message: 'Reports successfully combined. Check the data folder for the comprehensive report.' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing reports', error: error.message });
    }
});

module.exports = router;
