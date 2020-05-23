#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

echo '#####################################################'
echo '#######' Running prop-size microbenchmark '     #######'
echo '#######  ' output dif is ${resdir}         '#######'
echo '#####################################################'

pushd ../app

for propsize in {1,10,25,50,100,250}
do
    echo '########'
    echo '######' Running app with propsize ${propsize}
    echo '########'

    export WATCHTOWER_MBMARK_PROP_SIZE=${propsize}

    sls deploy
    sleep 60

    API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; export API_URL=$API_URL/microbmark

    for i in {1..250}
    do
        if ((i % 25 == 0))
        then
            sleep 5
        fi

        curl ${API_URL}
    done

    sleep 180

    node ../../scripts/get-wt-times.js ../${resdir}/checker-${propsize} ../${resdir}/ingest-${propsize}

    sls remove

    sleep 60

    unset WATCHTOWER_MBMARK_PROP_SIZE
done

popd




echo '####################'
echo '#######' Done '#######'
echo '####################'
