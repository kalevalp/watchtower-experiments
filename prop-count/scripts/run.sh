#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

echo '#####################################################'
echo '#######' Running prop-count microbenchmark '    #######'
echo '#######  ' output dif is ${resdir}         '#######'
echo '#####################################################'



for kind in {shared-props,disj-props}
do
    pushd ../${kind}

    for props in {1,5,10,15,20,30,50}
    do
        echo '########'
        echo '######' Running ${kind} with ${props} properties
        echo '########'

        export WATCHTOWER_MBMARK_ID_COUNT=${props}
        export WATCHTOWER_MBMARK_PROP_COUNT=${props}

        sleep 60
        sls deploy
        sleep 60

        API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; export API_URL=$API_URL/microbmark

        for i in {1..1000}
        do
            if ((i % 50 == 0))
            then
                echo -n .
                sleep 5
            fi

            curl ${API_URL}
        done

        sleep 60

        node ../../scripts/get-wt-times.js ${resdir}/${kind}-checker-${props} ${resdir}/${kind}-ingest-${props}

        sls remove

        unset WATCHTOWER_MBMARK_ID_COUNT
        unset WATCHTOWER_MBMARK_PROP_COUNT
    done

    popd

done


echo '####################'
echo '#######' Done '#######'
echo '####################'
