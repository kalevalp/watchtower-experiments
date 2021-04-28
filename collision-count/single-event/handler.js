'use strict'
const dummy  = require('dummy')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports.hello = async (event, context) => {
    console.log(`Handling event with id ${event.body} at time ${Date.now()}`)

    const id = event.body

    dummy(id)

    return {
        statusCode: 200,
        body: 'Done.',
    }
}
