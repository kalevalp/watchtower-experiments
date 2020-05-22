const createProp = (id) => {
    const prop = {
        name: `dummy-${id}`,
        quantifiedVariables: ['someid'],
        projections: [['someid']],
        stateMachine: {}
    }

    prop.stateMachine[`EVENT_TYPE_A_${id}`] = {
	    params: ['someid'],
	    'INITIAL': { to: 'state1', },
	    'state1':  { to: 'INITIAL', },
	    'state2':  { to: 'INITIAL', },
    }

    prop.stateMachine[`EVENT_TYPE_B_${id}`] = {
	params: ['someid'],
	'state1':  { to: 'state2', },
	'state2':  { to: 'state1', },
    }

    prop.stateMachine[`EVENT_TYPE_C_${id}`] = {
	params: ['someid'],
	'INITIAL': { to: 'SUCCESS', },
        'state1' : { to: 'SUCCESS', },
        'state2' : { to: 'FAILURE', },
    }

    return prop;
};

let properties = [];

properties.length = Number(process.env['WATCHTOWER_MBMARK_PROP_COUNT']);
properties = properties.fill().map((c, i) => createProp(i));

module.exports = properties;
