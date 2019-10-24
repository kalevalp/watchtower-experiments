#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

for kind in {loop-once,loop-twice,loop-twice-possible-alarm,sleep-once,sleep-twice,sleep-twice-possible-alarm}
do
    echo Running ${kind}

    pushd ../${kind}

    sls deploy -v
    sleep 5
    sls deploy -v
    sleep 5
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

    node notification-delay-times.js ${resdir}/${kind}-notif-delay

    pushd ../${kind}

    sls remove -v

    popd

done
