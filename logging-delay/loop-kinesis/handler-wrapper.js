const eventsStreamName = process.env ['WATCHTOWER_EVENT_KINESIS_STREAM'];
const recorder = require('watchtower-recorder');
const publisher = recorder.createEventPublisher(eventsStreamName);
const uuidv4 = require('uuid/v4');

let context;
let lambdaExecutionContext;
let lambdaInputEvent;
function updateContext(name, event, lambdaContext) {
    context = name;
    lambdaExecutionContext = lambdaContext;
    lambdaInputEvent = event;
}

const mock = {
    'dummy': {
        operation: () => {
            return publisher({name: 'DUMMY_EVENT', params: {id: uuidv4()}}, lambdaExecutionContext);
        },
    },
};

module.exports.hello = recorder.createRecordingHandler('handler.js', 'hello' , mock, false, updateContext);
