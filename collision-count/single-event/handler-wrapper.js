const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const propertyCount = Number(process.env['WATCHTOWER_MBMARK_PROP_COUNT']);

const recorder = require('watchtower-recorder');
const publisher = recorder.createEventPublisher(eventsStreamName);

let context;
let lambdaExecutionContext;
let lambdaInputEvent;
function updateContext(name, event, lambdaContext) {
    context = name;
    lambdaExecutionContext = lambdaContext;
    lambdaInputEvent = event;
}

const mock = {
    'dummy': (eventid) => {
        const op = Math.random() < 0.33 ? 'A' : Math.random() < 0.50 ? 'B' : 'C'
        return publisher({name: `EVENT_TYPE_${op}`, params: {eventid: eventid}}, lambdaExecutionContext)
    },
};

module.exports.hello = recorder.createRecordingHandler('handler.js', 'hello' , mock, false, updateContext);
