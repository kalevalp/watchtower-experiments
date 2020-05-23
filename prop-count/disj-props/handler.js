'use strict';
const dummy  = require('dummy');
const uuidv4 = require('uuid/v4');

const propertyCount = Number(process.env['WATCHTOWER_MBMARK_PROP_COUNT']);
const idCount       = Number(process.env['WATCHTOWER_MBMARK_ID_COUNT']);

let idPool = [];
idPool.length = idCount;
idPool = idPool.fill().map(() => uuidv4());


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.hello = async (event, context) => {
    // Randomly choose a scenario
    const scenario = Math.floor(Math.random() * 2);

    // With a probabilty of 50%, run a failing run on a *new* random id, for a random prop.
    if (scenario === 0) {
        const id = uuidv4();
        const prop = Math.floor(Math.random() * propertyCount);

        dummy('A', id, prop);
        await sleep(250);
        dummy('B', id, prop);
        await sleep(250);
        dummy('C', id, prop);
    }

    // With a probability of 50%, run a series of 3 random non-terminating events.
    else {
        for (let i = 0; i < 3; i++) {
            const id = idPool[Math.floor(Math.random() * idCount)];
            await sleep(100);
            const choice = Math.floor(Math.random() * 3);
            const op = choice === 0 ? 'A' : choice === 1 ? 'B' : 'C'
            dummy(op, id);
        }
    }

    return {
        statusCode: 200,
        body: 'Done.',
    };
};
