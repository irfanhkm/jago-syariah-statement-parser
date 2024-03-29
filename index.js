import generateCdvFromPdf from "./pdfReader.js";
import fs from 'fs';

const logFileName = 'processLog';
const processLog = fs.readFileSync(logFileName, "utf8");
const processedFile = processLog.split('\n');

fs.readdirSync('input')
    .filter(fileName => fileName.includes(".pdf") && !processedFile.includes(fileName))
    .forEach(fileName => {
	    generateCdvFromPdf(fileName, logFileName)
	}
    );
