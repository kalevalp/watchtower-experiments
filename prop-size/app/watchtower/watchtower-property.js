const propSize = Number(process.env['WATCHTOWER_MBMARK_PROP_SIZE'])

let prop = {
    name: 'dummy',
    quantifiedVariables: ['someid'],
    projections: [['someid']],
    stateMachine: {
	'EVENT_TYPE_A': {
	    params: ['someid'],
	},
	'EVENT_TYPE_B': {
	    params: ['someid'],
 	},
	'EVENT_TYPE_C': {
	    params: ['someid'],
	},
        'EVENT_TYPE_D': { // Move to the next phase of the property
            'INITIAL': { to: 'state-0-0', },
        }
    },
}

for ( let i = 0; i < propSize; i++ ) {

    prop.stateMachine[ 'EVENT_TYPE_A' ][ `state-${i}-0` ] = { to: `state-${i}-1`, };
    prop.stateMachine[ 'EVENT_TYPE_A' ][ `state-${i}-1` ] = { to: `state-${i}-0`, };
    prop.stateMachine[ 'EVENT_TYPE_A' ][ `state-${i}-2` ] = { to: `state-${i}-0`, };

    prop.stateMachine[ 'EVENT_TYPE_B' ][ `state-${i}-1` ] = { to: `state-${i}-2`, };
    prop.stateMachine[ 'EVENT_TYPE_B' ][ `state-${i}-2` ] = { to: `state-${i}-1`, };

    prop.stateMachine[ 'EVENT_TYPE_C' ][ `state-${i}-0` ] = { to: `SUCCESS`, };
    prop.stateMachine[ 'EVENT_TYPE_C' ][ `state-${i}-1` ] = { to: `SUCCESS`, };
    prop.stateMachine[ 'EVENT_TYPE_C' ][ `state-${i}-2` ] = { to: `FAILURE`, };

}

for ( let i = 0; i < propSize - 1; i++ ) {

    prop.stateMachine[ 'EVENT_TYPE_D' ][ `state-${i}-0` ] = { to: `state-${i+1}-0`, };
    prop.stateMachine[ 'EVENT_TYPE_D' ][ `state-${i}-1` ] = { to: `state-${i+1}-1`, };
    prop.stateMachine[ 'EVENT_TYPE_D' ][ `state-${i}-2` ] = { to: `state-${i+1}-2`, };

}

module.exports = [ prop ];
