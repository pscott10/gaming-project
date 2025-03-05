const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');


//Reads and parses a CSV file, skipping first 3 lines
const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const data = [];

        fs.createReadStream(filePath)
            .pipe(csv({skipLines : 3}))
            .on('data', (row) => data.push(row))
            .on('end', () => resolve(data))
            .on('error', (error) => reject(`Error reading file ${filePath}: ${error.message}`));
    });
};

//Combines multiple CSV reports into a single dataset
const combineReports = async (inputFiles) => {
    try{
        const combinedData = [];

        for(const file of inputFiles){
            console.log(`Processing file: ${file}`);
            const fileData = await readFile(file);
            combinedData.push(...fileData);
        }

        console.log(`Total rows combined: ${combinedData.length}`);
        return combinedData;
    } catch (error) {
        console.error(`Error combining reports: ${error}`);
        throw error;
    }
};

//Writes combined dataset to a CSV file
const writeFile = async (outputFile, data) => {
    if(data.length === 0){
        console.warn('No data to write.');
        return;
    }

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

    try {
        await csvWriter.writeRecords(data);
        console.log(`Combined report saved to ${outputFile}`);
    } catch (error) {
        console.error(`Error writing CSV file: ${error}`);
    }
};

//Main function to combine reports and write to CSV file
const processReports = async (inputFiles, outputFile) => {
    try{
        const combinedData = await combineReports(inputFiles);
    } catch (error) { 
        console.error(`Error processing reports: ${error}`);
    }
};

module.exports = processReports;