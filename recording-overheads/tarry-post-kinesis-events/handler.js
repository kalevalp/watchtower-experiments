'use strict';
const dummy = require('dummy');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.hello = async (event, context) => {
    dummy.operation();
    await sleep(100);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0! Your function executed successfully!',
            input: event,
        }),
    };
};
