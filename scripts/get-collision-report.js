const scripts = require('watchtower-anaysis-scripts');

let outputfname = process.argv[2]
let rate = process.argv[3]

const log_scraper = require('cloudwatch-log-scraper');
const fs = require('fs');

const scraper = new log_scraper.LogScraper('eu-west-1');

function getRandFname() {
    const fiveDigitID = Math.floor(Math.random() * Math.floor(99999));
    return `runResults-${fiveDigitID}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const reportPattern = '?START ?REPORT';

    const startRE = /START RequestId: ([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/

    const runReportRE = /REPORT RequestId: ([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tDuration: ([0-9]*\.[0-9]*) ms.*Max Memory Used: ([0-9]*) MB/
    const totalPathsRE = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tINFO\t@@@@WT_PROF: PATHS REPORT - TOTAL CHECKED PATHS: --(.*)--/
    const maxPathsRE = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tINFO\t@@@@WT_PROF: PATHS REPORT - MAXIMUM WIDTH: --(.*)--/
    const avgPathsRE = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tINFO\t@@@@WT_PROF: PATHS REPORT - AVERAGE WIDTH: --(.*)--/

    const logGroup = '/aws/lambda/wt-collision-count-test-watchtower-monitor';

    const streams = await scraper.getAllLogStreamsOfGroup(logGroup)
    let logItems = []

    for (const stream of streams) {
        let execReport;

        let streamDone = true
        do {
            execReport = await scraper.getAllLogItemsForStreamMatching(logGroup, stream, reportPattern);

            let execIDs = execReport.filter(item => item.message.match(startRE)).map(item => item.message.match(startRE)[1])

            for (const execID of execIDs) {
                if (!execReport.find(
                    item => item.message.match(runReportRE) && item.message.match(runReportRE)[1] === execID
                )) {
                    console.log(`Checker still running in stream ${stream}. Sleeping for 1min.`)
                    await sleep(1000)
                }
            }
        } while (!streamDone)

        logItems.push({stream,execReport})
    }

    // const logItems = await Promise.all(streams.map(stream => scraper.getAllLogItemsForStreamMatching(logGroup,stream,reportPattern).then(execReport => ({stream, execReport}))))

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
                let singleRes = {concurrency:rate,executionTime, memoryUse}

                let totalPaths = totalPathsReports.find(item => item[1] === invocation)
                let maxPaths = maxPathsReports.find(item => item[1] === invocation)
                let avgPaths = avgPathsReports.find(item => item[1] === invocation)

                if (totalPaths && maxPaths && avgPaths) {
                    console.log(`Successful run, collecting report for stream ${stream} invocation ${invocation}`)
                    singleRes.totalPaths = totalPaths[2]
                    singleRes.maxPaths = maxPaths[2]
                    singleRes.avgPaths = avgPaths[2]
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

    console.log(`Writing JSON to file: ${outputfname}.json`)

    fs.writeFileSync(`${outputfname}.json`, JSON.stringify(reports));


    console.log(`Writing csv to file: ${outputfname}.csv`)

    let reportStr = ""
    reportStr += "concurrency,cpuTime,mem,totalPaths,maxPaths,avgPaths\n"

    for (const report of reports) {
        reportStr += `${rate},${report.executionTime},${report.memoryUse},${report.totalPaths ? report.totalPaths : ''},${report.maxPaths ? report.maxPaths : ''},${report.avgPaths ? report.avgPaths : ''}\n`
    }

    console.log(reportStr)

    fs.writeFileSync(`${outputfname}.csv`, reportStr);
}

main();


