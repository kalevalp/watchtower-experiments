const scripts = require('watchtower-anaysis-scripts');

const checker_times = process.argv[2];
const ingest_times = process.argv[3];

scripts.checkerRunTimes('eu-west-1','wt-full-flow-test',`${checker_times}`);
scripts.ingestionRunTimes('eu-west-1','wt-full-flow-test',`${ingest_times}`);
