'use strict';
const dummy = require('dummy');
const uuidv4 = require('uuid/v4');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.hello = async (event, context) => {
    await sleep(100);

    const opid = uuidv4();
    dummy.operationA(opid);

    await sleep(100);

    dummy.operationB(opid);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Done.',
            opid
        }),
    };
};
