const scripts = require('watchtower-anaysis-scripts');

const log_scraper = require('cloudwatch-log-scraper');
const fs = require('fs');

const scraper = new log_scraper.LogScraper('eu-west-1');

function getRandFname() {
    const fiveDigitID = Math.floor(Math.random() * Math.floor(99999));
    return `runResults-${fiveDigitID}`;
}

async function main() {
    const reportPattern = 'REPORT';

    const runReportRE = /REPORT RequestId: ([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tDuration: ([0-9]*\.[0-9]*) ms.*Max Memory Used: ([0-9]*) MB/
    const totalPathsRE = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tINFO\t@@@@WT_PROF: PATHS REPORT - TOTAL CHECKED PATHS: --(.*)--/
    const maxPathsRE = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tINFO\t@@@@WT_PROF: PATHS REPORT - MAXIMUM WIDTH: --(.*)--/
    const avgPathsRE = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tINFO\t@@@@WT_PROF: PATHS REPORT - AVERAGE WIDTH: --(.*)--/

    const logGroup = '/aws/lambda/wt-collision-count-test-watchtower-monitor';

    const streams = await scraper.getAllLogStreamsOfGroup(logGroup)
    const logItems = await Promise.all(streams.map(stream => scraper.getAllLogItemsForStreamMatching(logGroup,stream,reportPattern).then(execReport => ({stream, execReport}))))

    let reports = logItems.flatMap(({stream, execReport}) => {
        if (execReport.length > 0) {
            let res = []
            let runReports = execReport.map(item => item.message.match(runReportRE)).filter(item => item)
            let totalPathsReports = execReport.map(item => item.message.match(totalPathsRE)).filter(item => item)
            let maxPathsReports = execReport.map(item => item.message.match(maxPathsRE)).filter(item => item)
            let avgPathsReports = execReport.map(item => item.message.match(avgPathsRE)).filter(item => item)

            for (const report of runReports) {
                let invocation = report[1]
                let executionTime = report[2]
                let memoryUse = report[3]
                let singleRes = {executionTime, memoryUse}

                let totalPaths = totalPathsReports.find(item => item[1] === invocation)[2]
                let maxPaths = maxPathsReports.find(item => item[1] === invocation)[2]
                let avgPaths = avgPathsReports.find(item => item[1] === invocation)[2]

                if (totalPaths && maxPaths && avgPaths) {
                    console.log(`Successful run, collecting report for stream ${stream} invocation ${invocation}`)
                    singleRes.totalPaths = totalPaths
                    singleRes.maxPaths = maxPaths
                    singleRes.avgPaths = avgPaths
                } else {
                    console.log(`Failed run for stream ${stream} invocation ${invocation}`)
                }
                res.push(singleRes)
            }

            return res
        } else {
            console.log("UNEXPECTED ERROR - no log events matching 'REPORT'.")
        }
    });

    console.log(reports)

    let outputfname = getRandFname();

    if (process.argv[2]) {
        outputfname = process.argv[2];
    }

    fs.writeFileSync(outputfname, JSON.stringify(reports));
}

main();


