#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

for kind in {loop,sleep}
do
    echo Running ${kind}

    pushd ../${kind}

    sleep 60
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

    node full-profile-report-times.js ${resdir}/${kind}-full-prof-report

    pushd ../${kind}

    sls remove

    popd

done
