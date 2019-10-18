'use strict';
const zlib = require('zlib');

module.exports.handler = async (event, context) => {
    const invocationTime = Date.now();
    console.log(JSON.stringify(event));

    const payload = new Buffer(event.awslogs.data, 'base64');
    const logBatch = JSON.parse(zlib.gunzipSync(payload).toString('ascii'));

    for (const logEvent of logBatch.logEvents) {
        console.log(JSON.stringify(logEvent));
        console.log(`######## Logging delay is: ${invocationTime-logEvent.timestamp}ms`)
    }
};
