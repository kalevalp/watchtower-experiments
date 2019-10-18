#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

#for kind in {loop-kinesis,tarry-kinesis}
for kind in {loop-kinesis,loop-log,regular-kinesis,regular-log,tarry-kinesis,tarry-log}
do
    echo Running ${kind}

    pushd ../${kind}

    if [ ! -d "node_modules" ]; then
      echo "Package not installed for experiment" ${kind}
      echo "Run build.sh and rerun experiments. Exiting."
      exit -1
    fi

    sls deploy -v
    sleep 60
    API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; export API_URL=$API_URL/microbmark

    popd

    for i in {1..100}
    do
	    curl $API_URL
    done

    unset API_URL

    sleep 60

    node log-event-delay.js ${resdir}/${kind}-times

    pushd ../${kind}

    sls remove -v

    popd

done
