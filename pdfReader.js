import fs from 'fs';
import PDF from "pdf-parse/lib/pdf-parse.js";
import moment from 'moment';

export default async function generateCdvFromPdf(fileName, logFileName) {
    console.log(fileName);
    try {
        const rawfileName = fileName.replace(".pdf", "");
        const dataBuffer = fs.readFileSync(`./input/${rawfileName}.pdf`);
        const options = {
            pagerender: render_page
        }
        const data = await PDF(dataBuffer, options);
        const textInArray = processPdfData(data.text);

        fs.writeFileSync(`./output/${rawfileName}.csv`, textInArray.join('\n'));
        fs.appendFileSync(logFileName, fileName + "\n");
        console.log(`success save: ./output/${rawfileName}.csv`);
        return true;
    } catch(error) {
        console.error(`error file: ${fileName}, error: ${error}`)
        return false;
    }
}

function processPdfData(textData) {
    const lineArray = textData.split("\n");
    const csvIdentifier = "~";
    const finalArr = [`date${csvIdentifier}title${csvIdentifier}amount${csvIdentifier}comment`];
    const startPage = lineArray.indexOf("Source/Destination");

    for (let i = startPage + 1; i < lineArray.length; i++) {
        const currentDate = lineArray[i];
        if (isValidDateFormat(currentDate)) {
            const rawData = lineArray.slice(i, i + 15);
            if (bannedWords.filter(x => !rawData.includes(x)).length == 0) {
                continue;
            }
            const transformedLines = transformLines(rawData);
            if (transformedLines) {
                finalArr.push(transformedLines.join(csvIdentifier));
            } else {
                console.error(`Failed parsed this data: ${rawData}`);
            }
        } 
    }

    return finalArr;
}

const bannedWords = ['Previous Balance', 'Total Incoming', 'Total Outgoing', 'Closing Balance', 'Source/Destination', 'Transaction Details']

function transformLines(lines) {
    const regexAmount = /^[+-]\d+$/; // checking expense or income identifier
    const indexAmount = lines.findIndex(data => data.replace(/\./g, '').match(regexAmount));
    const dateTime = moment(lines[0] + " " + lines[1], 'DD MMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm:ssZ');
    if (indexAmount !== -1) {
        return [
            dateTime, // datetime
            lines[2] + " " + lines[3], // receiver account
            lines[indexAmount].replace(/[+.]/g, ''), // amount
            lines.slice(4, indexAmount).join(" "), // remark
        ];
    }

    return null;
}

// default render callback
function render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: true,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
        .then(function(textContent) {
            let lastY, text = '';
            for (let i = 0; i < textContent.items.length; i++) {
                let item = textContent.items[i];
                
                // skipping empty
                if (item === undefined) {
                    continue;
                }
                
                text += '\n' + item.str;
            }
            return text;
        });
}

function isValidDateFormat(dateString) {
    const dateFormat = 'DD MMM YYYY';
    const parsedDate = moment(dateString, dateFormat, true);

    // Check if the parsed date is valid and the input matches the specified format
    return parsedDate.isValid() && parsedDate.format(dateFormat) === dateString;
}
