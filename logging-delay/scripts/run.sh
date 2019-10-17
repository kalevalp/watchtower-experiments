#! /bin/bash

for kind in {no-wrapper,log-events,kinesis-events,tarry-post-kinesis-events,tarry-post-log-events,tarry-pre-kinesis-events,tarry-pre-log-events,tarry-post-no-wrapper,tarry-pre-no-wrapper}
do
    echo Running ${kind}

    pushd ../

    cp serverless.yml-${kind} serverless.yml
    sls deploy -v
    API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; export API_URL=$API_URL/microbmark

    popd

    echo -n > e2e-${kind}
    for i in {1..100}
    do
	( time curl $API_URL ) 2>> e2e-${kind}
    done

    unset API_URL

    sleep 30

    node function-execution-times.js ${kind}-times

    pushd ../

    sls remove -v

    rm serverless.yml

    popd

done
