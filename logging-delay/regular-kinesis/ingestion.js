'use strict';

module.exports.handler = async (event, context) => {
    const invocationTime = Date.now();

    console.log(JSON.stringify(event));


    if (event.Records && event.Records.length > 0 ) {
        for (const record in event.Records) {
            let dataString = Buffer.from(record.kinesis.data,'base64').toString();
            console.log(dataString);
            const data = JSON.parse(dataString);
            console.log(`######## Logging delay is: ${invocationTime-data.timestamp}ms`)
        }
    }
};
