const createProp = () => {
    const prop = {
        name: `dummy`,
        quantifiedVariables: ['id'],
        projections: [['id']],
        stateMachine: {}
    }

    prop.stateMachine[`EVENT_TYPE_A`] = {
	    params: ['id'],
	    'INITIAL': { to: 'state1', },
	    'state1':  { to: 'INITIAL', },
        'state2' : { to: 'state2', },
    }

    prop.stateMachine[`EVENT_TYPE_B`] = {
        params: ['id'],
        'INITIAL': { to: 'INITIAL', },
        'state1':  { to: 'state1', },
        'state2' : { to: 'state2', },
    }

    prop.stateMachine[`EVENT_TYPE_C`] = {
        params: ['id'],
        'INITIAL': { to: 'INITIAL', },
        'state1':  { to: 'state1', },
        'state2' : { to: 'FAILURE', },
    }

    return prop;
};

let properties = [createProp()];

module.exports = properties;
