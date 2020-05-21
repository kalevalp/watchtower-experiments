const log_scraper = require('cloudwatch-log-scraper');
const fs = require('fs');

const scraper = new log_scraper.LogScraper('eu-west-1');

function getRandFname() {
    const fiveDigitID = Math.floor(Math.random() * Math.floor(99999));
    return `runResults-${fiveDigitID}`;
}

async function main() {

    const fullRepRE = /@@@@WT_PROF: FULL REPORT ---(.*)---/

    const logGroup = '/aws/lambda/wt-full-flow-test-watchtower-monitor';
    const logItems = await scraper.getAllLogItemsForGroup(logGroup);

    const reports = logItems.filter(item => item.message.match(fullRepRE)).map(item => JSON.parse(item.message.match(fullRepRE)[1]));

    const fullReports = reports.map(rep =>
                                    [rep.eventOccuredTimestamp - rep.eventOccuredTimestamp,
                                     rep.eventKinesisArrivedTimestamp - rep.eventOccuredTimestamp,
                                     rep.ingestionFunctionStartTime - rep.eventOccuredTimestamp,
                                     rep.ddbWriteTime - rep.eventOccuredTimestamp,
                                     rep.instanceTriggerKinesisTime - rep.eventOccuredTimestamp,
                                     rep.checkerFunctionInvokeTime - rep.eventOccuredTimestamp,
                                     rep.violationDetectionTime - rep.eventOccuredTimestamp]
                                   );

    let outputfname = getRandFname();

    if (process.argv[2]) {
        outputfname = process.argv[2];
    }

    fs.writeFileSync(outputfname, JSON.stringify(fullReports));
}

main();
