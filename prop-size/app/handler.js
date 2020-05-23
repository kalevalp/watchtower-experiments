'use strict';
const dummy  = require('dummy');
const uuidv4 = require('uuid/v4');

const idCount = Number(process.env['WATCHTOWER_MBMARK_ID_COUNT']);

let idPool = [];
idPool.length = idCount;
idPool = idPool.fill().map(() => uuidv4());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.hello = async (event, context) => {
    // Randomly choose a scenario
    const scenario = Math.floor(Math.random() * 2);

    // With a probabilty of 50%, run a failing run on a *new* random id.
    if (scenario === 0) {
        const id = uuidv4();

        dummy('D', id)
        await sleep(50);
        dummy('A', id);
        await sleep(50);
        dummy('B', id);
        await sleep(50);
        dummy('C', id);
    }

    // With a probability of 50%, run a series of 4 random events.
    // Of these, with a 25% probability switch layers (event D)
    else {
        for (let i = 0; i < 4; i++) {
            const id = idPool[Math.floor(Math.random() * idCount)];
            await sleep(50);

            const toss = Math.floor(Math.random() * 4);
            const ev = toss === 0 ? 'D' : toss === 1 ? 'A' : toss === 2 ? 'B' : 'C';

            dummy(ev, id);
        }
    }

    return {
        statusCode: 200,
        body: 'Done.',
    };
};
