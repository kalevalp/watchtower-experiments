const scripts = require('watchtower-anaysis-scripts');

const collisions = process.argv[2];

scripts.checkerRunTimes('eu-west-1','wt-collision-count',`${collisions}`);
