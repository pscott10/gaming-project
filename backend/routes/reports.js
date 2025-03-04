const express = require('express');
const combineReports = require('../combineReports');
const router = express.Router();

router.post('/combine', (req, res) => {
    const inputFiles = ['./data/AdamsVGRevenueReport.csv', './data/AltamontVGRevenueReport.csv'];
    const filters = req.body.filters;
    const outputFile = './data/combined_report.csv';

    combineReports(inputFiles, outputFile, filters);

    res.json({message: 'Reports are being combined. Check the data folder for the comphrehensive report.' });
});

module.exports = router;
