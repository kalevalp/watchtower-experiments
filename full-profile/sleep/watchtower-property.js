const property = [{
    name: 'dummy',
    quantifiedVariables: ['eventid'],
    projections: [['eventid']],
    stateMachine: {
	'DUMMY_EVENT_TYPE_A': {
	    params: ['eventid'],
	    'INITIAL': {
		to: 'intermediate',
	    },
	    'intermediate': {
		to: 'SUCCESS',
	    },
	},
	'DUMMY_EVENT_TYPE_B': {
	    params: ['eventid'],
	    'INITIAL': {
		to: 'SUCCESS',
	    },
	    'intermediate': {
		to: 'FAILURE',
	    },
	},
	'DUMMY_EVENT_TYPE_C': {
	    params: ['eventid'],
	    'INITIAL': {
		to: 'INITIAL',
	    },
	    'intermediate': {
		to: 'INITIAL',
	    },
	},
    },
}];

module.exports = property;
