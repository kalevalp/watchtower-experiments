const property = {
    // name: 'dummy',
    quantifiedVariables: ['someid'],
    projections: [['someid']],
    stateMachine: {
	'EVENT_TYPE_A': {
	    params: ['someid'],
	    'INITIAL': { to: 'state1', },
	    'state1':  { to: 'INITIAL', },
	    'state2':  { to: 'INITIAL', },
	},
	'EVENT_TYPE_B': {
	    params: ['someid'],
	    'state1':  { to: 'state2', },
	    'state2':  { to: 'state1', },
 	},
	'EVENT_TYPE_C': {
	    params: ['someid'],
	    'INITIAL': { to: 'SUCCESS', },
            'state1' : { to: 'SUCCESS', },
            'state2' : { to: 'FAILURE', },
	},
    },
};

let properties = [];

properties.length = Number(process.env['WATCHTOWER_MBMARK_PROP_COUNT']);
properties = properties.fill().map((c, i) => {const res = Object.assign({}, property); res.name = `dummy-${i}`; return res;});

module.exports = properties;
