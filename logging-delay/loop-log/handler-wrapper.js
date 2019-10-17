const recorder = require('watchtower-recorder');
const publisher = recorder.createEventPublisher();
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

module.exports.hello = recorder.createRecordingHandler('handler-tarry-post.js', 'hello' , mock, false, updateContext);
