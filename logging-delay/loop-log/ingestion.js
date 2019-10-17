'use strict';

module.exports.handler = async (event, context) => {
    const invocationTime = Date.now();
    console.log(JSON.stringify(event));
};
