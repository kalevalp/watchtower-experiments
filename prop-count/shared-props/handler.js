'use strict';
const dummy  = require('dummy');
const uuidv4 = require('uuid/v4');

const propertyCount = Number(process.env['WATCHTOWER_MBMARK_PROP_COUNT']);
const idCount       = Number(process.env['WATCHTOWER_MBMARK_ID_COUNT']);

const idPool = [];
idPool.length = idCount;
idPool.fill().map(() => uuidv4());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.hello = async (event, context) => {
    // Randomly choose a scenario
    const scenario = Math.floor(Math.random() * 20);

    // With a probabilty of 5%, run a failing run on a *new* random id, for a random prop.
    if (scenario === 0) {
        const id = uuidv4();
        const prop = Math.floor(Math.random() * propertyCount);

        dummy('A', id, prop);
        await sleep(250);
        dummy('B', id, prop);
        await sleep(250);
        dummy('C', id, prop);
    }

    // With a probabilty of 5%, run a terminating event on a random id, for a random prop.
    else if (scenario === 1) {
        await sleep(100);
        dummy('C', id); // No need to specify a prop, it'll be automatically chosen
        await sleep(100);
    }

    // With a probability of 90%, run a series of 20 random non-terminating events.
    else {
        for (let i = 0; i < 20; i++) {
            const id = idPool[Math.floor(Math.random * idCount)];
            await sleep(100);
            dummy(Math.random() < 0.5 ? 'A' : 'B', id);
        }
    }

    return {
        statusCode: 200,
        body: 'Done.',
    };
};
