'use strict'
const dummy = require('dummy')

module.exports.hello = async (event, context) => {
    console.log(`Handling event with input ${event.body} at time ${Date.now()}`)

    const input = Number(event.body)

    dummy(input === 200)

    return {
        statusCode: 200,
        body: 'Done.',
    }
}
