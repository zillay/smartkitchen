
function timeDelta( start, end, params, only_totals ) {
    // taken from,
    // https://gist.github.com/THEtheChad/1297617
    var delta = {}
      , measurements = {
            w: 604800000,
            d: 86400000,
            h: 3600000,
            m: 60000,
            s: 1000
            }
      , flags = params || 'wdhms'
    ;//var

    delta.ttl = delta.ms = Math.abs( end.getTime() - start.getTime() );

    // do caclulations for each flag
    for( var i = 0; i < flags.length; i++ ) {
        delta[ flags[i] ] = delta.ms / measurements[ flags[i] ];
        // unless totals are specified,
        // value is broken down into components
        if( !only_totals ) {
            delta[ flags[i] ] = Math.floor( delta[ flags[i] ] );
            delta.ms -= delta[ flags[i] ] * measurements[ flags[i] ];
        }
    };
    
    return delta;
}

const makeMinPercentage = (_main, slotNumber) => {
    const minPercentage = 
        _main.state.items[slotNumber].min_weight !== null 
        && _main.state.items[slotNumber].min_weight !== 0
        && _main.state.items[slotNumber].max_weight !== null 
        && _main.state.items[slotNumber].max_weight !== 0
        ? parseInt(
            (_main.state.items[slotNumber].min_weight 
            / _main.state.items[slotNumber].max_weight) * 100,
            10)
        : 0;
    return minPercentage;
}


export {
    timeDelta,
    makeMinPercentage,
}