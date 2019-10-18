const log_scraper = require('cloudwatch-log-scraper');
const fs = require('fs');

const scraper = new log_scraper.LogScraper('eu-west-1');

function getRandFname() {
    const fiveDigitID = Math.floor(Math.random() * Math.floor(99999));
    return `runResults-${fiveDigitID}`;
}

async function main() {
    let outputfname = getRandFname();

    if (process.argv[2]) {
        outputfname = process.argv[2];
    }

    let lgs = await scraper.getAllLogGroups();
    lgs = lgs.filter(item => item.match(/wtexp-log-delay-.*-watchtower-ingestion/));

    const delayReportRE = /######## Logging delay is: ([0-9]*)ms/;

    for (const logGroup of lgs) { // Should be just one.
        const logElements = await scraper.getAllLogItemsForGroup(logGroup);
        const delayTimes = logElements.filter(x => x.message.match(delayReportRE)).map(x => Number.parseInt(x.message.match(delayReportRE)[1]));
        fs.writeFileSync(outputfname, JSON.stringify(delayTimes));
    }
}

main();
