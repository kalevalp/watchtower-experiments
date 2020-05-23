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

        sls deploy
        sleep 60

        API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; export API_URL=$API_URL/microbmark

        for i in {1..200}
        do
            if ((i % 25 == 0))
            then
                sleep 5
            fi

            curl ${API_URL}
        done

        sleep 240

        node ../../scripts/get-wt-times.js ../scripts/${resdir}/${kind}-checker-${props} ../scripts/${resdir}/${kind}-ingest-${props}

        sls remove

	sleep 60

        unset WATCHTOWER_MBMARK_ID_COUNT
        unset WATCHTOWER_MBMARK_PROP_COUNT
    done

    popd

done


echo '####################'
echo '#######' Done '#######'
echo '####################'
