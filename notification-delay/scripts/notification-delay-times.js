const log_scraper = require('cloudwatch-log-scraper');
const fs = require('fs');

const scraper = new log_scraper.LogScraper('eu-west-1');

function getRandFname() {
    const fiveDigitID = Math.floor(Math.random() * Math.floor(99999));
    return `runResults-${fiveDigitID}`;
}

async function main() {
    const notificationDelayRE = /@@@@WT_PROF: VIOLATION REPORT DELAY: ([0-9]*)\(ms\)/;
    const logGroup = '/aws/lambda/wt-full-flow-test-watchtower-monitor';
    const logItems = await scraper.getAllLogItemsForGroup(logGroup);

    const times = logItems.filter(item => item.message.match(notificationDelayRE)).map(item => Number(item.message.match(notificationDelayRE)[1]));

    let outputfname = getRandFname();

    if (process.argv[2]) {
        outputfname = process.argv[2];
    }

    fs.writeFileSync(outputfname, JSON.stringify(times));
}

main();

