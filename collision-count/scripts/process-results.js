const fs = require('fs')

const inputDir = process.argv[2]

const fileList = fs.readdirSync(inputDir)

const jsonFiles = fileList.filter(fname => fname.match(/.json/))

let runResults = []

for (const fname of jsonFiles) {
    const path = `${inputDir}/${fname}`
    runResults = runResults.concat(JSON.parse(fs.readFileSync(path)))
}

let average = (array) => array.reduce((a, b) => a + b, 0) / array.length;
let bigIntAverage = (array) => array.reduce((a, b) => a + b, 0n) / BigInt(array.length);

const tikzformatoutfname = `${inputDir}/processed-run-tikz.txt`
fs.writeFileSync(tikzformatoutfname, "Timeouts filtered out:\n")

const outfnamenoto = `${inputDir}/processed-run.csv`
fs.writeFileSync(outfnamenoto, 'concurrency,executionTime,memoryUse,totalPaths,maxPaths,avgPaths\n')

let averageExecutionTimeStr = ''
let averageMemStr = ''
let averageTotalPathsStr = ''
let averageMaxPathsStr = ''
let averageAvgPathsStr = ''

for (let i = 0; i < 50; i++) {
    const currentRunResults = runResults.filter(run => Number(run.concurrency) === i && run.totalPaths)
    if (currentRunResults.length > 0) {
        const averageExecutionTime = average(currentRunResults.map(run => Number(run.executionTime)))
        const averageMem = average(currentRunResults.map(run => Number(run.memoryUse)))
        const averageTotalPaths = bigIntAverage(currentRunResults.map(run => BigInt(run.totalPaths)))
        const averageMaxPaths = average(currentRunResults.map(run => Number(run.maxPaths)))
        const averageAvgPaths = average(currentRunResults.map(run => Number(run.avgPaths)))

        fs.appendFileSync(outfnamenoto, `${i},${averageExecutionTime},${averageMem},${averageTotalPaths},${averageMaxPaths},${averageAvgPaths}\n`)

        averageExecutionTimeStr = averageExecutionTimeStr + `(${i},${averageExecutionTime})`
        averageMemStr = averageMemStr + `(${i},${averageMem})`
        averageTotalPathsStr = averageTotalPathsStr + `(${i},${averageTotalPaths})`
        averageMaxPathsStr = averageMaxPathsStr + `(${i},${averageMaxPaths})`
        averageAvgPathsStr = averageAvgPathsStr + `(${i},${averageAvgPaths})`
    }
}

fs.appendFileSync(tikzformatoutfname, `    averageExecutionTimeStr:   ${averageExecutionTimeStr}\n`)
fs.appendFileSync(tikzformatoutfname, `    averageMemStr:             ${averageMemStr}\n`)
fs.appendFileSync(tikzformatoutfname, `    averageTotalPathsStr:      ${averageTotalPathsStr}\n`)
fs.appendFileSync(tikzformatoutfname, `    averageMaxPathsStr:        ${averageMaxPathsStr}\n`)
fs.appendFileSync(tikzformatoutfname, `    averageAvgPathsStr:        ${averageAvgPathsStr}\n`)


fs.appendFileSync(tikzformatoutfname, "\nTimeouts included:\n")

averageExecutionTimeStr = ''
averageMemStr = ''

const outfname = `${inputDir}/processed-run-w-to.csv`
fs.writeFileSync(outfname, 'concurrency,executionTime,memoryUse\n')

for (let i = 0; i < 50; i++) {
    const currentRunResults = runResults.filter(run => Number(run.concurrency) === i)
    if (currentRunResults.length > 0) {
        const averageExecutionTime = average(currentRunResults.map(run => Number(run.executionTime)))
        const averageMem = average(currentRunResults.map(run => Number(run.memoryUse)))

        fs.appendFileSync(outfname, `${i},${averageExecutionTime},${averageMem}\n`)
        averageExecutionTimeStr = averageExecutionTimeStr + `(${i},${averageExecutionTime})`
        averageMemStr = averageMemStr + `(${i},${averageMem})`

    }
}
fs.appendFileSync(tikzformatoutfname, `    averageExecutionTimeStr:   ${averageExecutionTimeStr}\n`)
fs.appendFileSync(tikzformatoutfname, `    averageMemStr:             ${averageMemStr}\n`)
