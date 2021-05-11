const createProp = () => {
    const prop = {
        name: `dummy`,
        quantifiedVariables: ['eventid'],
        projections: [['eventid']],
        stateMachine: {}
    }

    prop.stateMachine[`EVENT_TYPE_A`] = {
	    params: ['eventid'],
	    'INITIAL': { to: 'state1', },
	    'state1':  { to: 'INITIAL', },
        'state2' : { to: 'state2', },
    }

    prop.stateMachine[`EVENT_TYPE_B`] = {
        params: ['eventid'],
        'INITIAL': { to: 'INITIAL', },
        'state1':  { to: 'state1', },
        'state2' : { to: 'state2', },
    }

    prop.stateMachine[`EVENT_TYPE_C`] = {
        params: ['eventid'],
        'INITIAL': { to: 'INITIAL', },
        'state1':  { to: 'state1', },
        'state2' : { to: 'FAILURE', },
    }

    return prop;
};

let properties = [createProp()];

module.exports = properties;
