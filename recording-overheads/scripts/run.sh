#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

for kind in {log-events,kinesis-events,tarry-post-kinesis-events,tarry-post-log-events,tarry-pre-kinesis-events,tarry-pre-log-events}
do
    pushd ../${kind}

    if [ ! -d "node_modules" ]; then
      echo "Package not installed for experiment" ${kind}
      echo "Run build.sh and rerun experiments. Exiting."
      exit -1
    fi

    popd

done

for kind in {no-wrapper,log-events,kinesis-events,tarry-post-kinesis-events,tarry-post-log-events,tarry-pre-kinesis-events,tarry-pre-log-events,tarry-post-no-wrapper,tarry-pre-no-wrapper}
do
    echo Running ${kind}

    pushd ../${kind}

    sls deploy -v

    sleep 60

    API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; export API_URL=$API_URL/microbmark

    popd

    echo -n > ${resdir}/e2e-${kind}
    for i in {1..100}
    do
      ( time curl $API_URL ) 2>> ${resdir}/e2e-${kind}
    done

    unset API_URL
    sleep 60

    node function-execution-times.js ${resdir}/${kind}-times

    pushd ../${kind}
    sls remove -v
    popd

done
