'use strict';
const dummy = require('dummy');
const uuidv4 = require('uuid/v4');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.hello = async (event, context) => {
    let opid = uuidv4();

    await dummy.operationA(opid);
    await sleep(5);

    await dummy.operationB(opid);


    return {
        statusCode: 200,
        body: JSON.stringify({
	    message : 'Done.',
            opid
        }),
    };
};
