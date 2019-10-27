'use strict';
const dummy = require('dummy');
const uuidv4 = require('uuid/v4');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.hello = async (event, context) => {
    let opid;
    for (let i = 0; i < 25; i++) {
	opid = uuidv4();
	dummy.operationA(opid);
        await sleep(20);
    }
    dummy.operationB(opid);
    sleep(20);

    return {
        statusCode: 200,
        body: JSON.stringify({
	    message : 'Done.',
            opid
        }),
    };
};
