const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const combineReports = (inputFiles, outputFile, filters) => {
    let combinedData = [];

    console.log('Filters:', filters);

    inputFiles.forEach(file => {
        fs.createReadStream(file)
            .pipe(csv({ skipLines: 3 }))
            .on('data', (row) => {

                console.log('Processing row:', row);
                combinedData.push(row);
                /*
                if (
                    (filters.reportType === 'Statewide' || 
                     (filters.reportType === 'Municipality' && filters.municipalities.includes(row.Municipality)) ||
                     (filters.reportType === 'Establishment' && filters.establishments.includes(row.Establishment))) &&
                    (!filters.dateRange || (row['Report Date'] >= filters.dateRange.start && row['Report Date'] <= filters.dateRange.end))
                ) {
                    console.log('Row matches filters:', row);

                    combinedData.push(row);
                } */
            })
            .on('end', () => {
                console.log(`Finished processing file: ${file}`);

                if (file === inputFiles[inputFiles.length - 1]) {
                    console.log('Combined data:', combinedData);

                    const csvWriter = createObjectCsvWriter({
                        path: outputFile,
                        header: [
                            { id: 'Municipality', title: 'Municipality' },
                            { id: 'Establishment', title: 'Establishment' },
                            { id: 'License Number', title: 'License Number' },
                            { id: 'VGT Count', title: 'VGT Count' },
                            { id: 'Amount Played', title: 'Amount Played' },
                            { id: 'Amount Won', title: 'Amount Won' },
                            { id: 'Net Wager', title: 'Net Wager' },
                            { id: 'Funds In', title: 'Funds In' },
                            { id: 'Funds Out', title: 'Funds Out' },
                            { id: 'Net Terminal Income', title: 'Net Terminal Income' },
                            { id: 'NTI Tax', title: 'NTI Tax' },
                            { id: 'State Share', title: 'State Share' },
                            { id: 'Municipality Share', title: 'Municipality Share' },
                        ],
                    });

                    csvWriter.writeRecords(combinedData)
                        .then(() => {
                            console.log(`Combined report saved to ${outputFile}`);
                        });
                }
            });      
    });
};

module.exports = combineReports;