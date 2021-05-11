'use strict'
const dummy  = require('dummy')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports.hello = async (event, context) => {
    console.log(`Handling event with eventid ${event.body} at time ${Date.now()}`)

    const eventid = event.body

    dummy(eventid)

    return {
        statusCode: 200,
        body: 'Done.',
    }
}
