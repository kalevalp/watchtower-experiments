#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

for kind in {loop,sleep}
do
    echo Running ${kind}

    pushd ../${kind}

    sls deploy
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
