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
    'dummy': (op, id, fp) => {
        const forProp = fp ? fp : Math.floor(Math.random() * propertyCount);
        return publisher({name: `EVENT_TYPE_${op}`, params: {someid: id, forProp}}, lambdaExecutionContext);
    },
};

module.exports.hello = recorder.createRecordingHandler('handler.js', 'hello' , mock, false, updateContext);
