'use strict';
const dummy  = require('dummy');
const uuidv4 = require('uuid/v4');

const idCount       = Number(process.env['WATCHTOWER_MBMARK_ID_COUNT']);

const idPool = [];
idPool.length = idCount;
idPool.fill().map(() => uuidv4());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.hello = async (event, context) => {
    // Randomly choose a scenario
    const scenario = Math.floor(Math.random() * 100);

    // With a probabilty of 1%, run a failing run on a *new* random id, for a random prop.
    if (scenario === 0) {
        const id = uuidv4();
        const prop = Math.floor(Math.random() * propertyCount);

        dummy('D', id)
        await sleep(250);
        dummy('A', id);
        await sleep(250);
        dummy('B', id);
        await sleep(250);
        dummy('C', id);
    }

    // With a probabilty of 1%, run a terminating event on a random id, for a random prop.
    else if (scenario === 1) {
        await sleep(100);
        dummy('C', id); // No need to specify a prop, it'll be automatically chosen
        await sleep(100);
    }

    // With a probability of 98%, run a series of 50 random non-terminating events.
    // Of these, with a 5% probability switch layers (event D)
    else {
        for (const i = 0; i < 20; i++) {
            const id = idPool[Math.floor(Math.random * idCount)];
            await sleep(100);

            const toss = Math.floor(Math.random() * 20);
            const ev = toss === 0 ? 'D' : toss < 11 ? 'A' : 'B'

            dummy(ev, id);
        }
    }

    return {
        statusCode: 200,
        body: 'Done.',
    };
};
