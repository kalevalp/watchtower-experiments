#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}



sleep 2

for parexec in {1,2,4,6,8,10}
do
    pushd ../app

    sleep 60
    sls deploy

    sleep 60
    API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; export API_URL=$API_URL/microbmark

    popd

    export pre=$(($(date +%s%N)/1000000))

    for i in $(seq 2 ${parexec})
    do
	./invoke.sh ${resdir} ${API_URL} ${i} ${parexec} &
    done

    ./invoke.sh ${resdir} ${API_URL} 1 ${parexec}

    export post=$(($(date +%s%N)/1000000))
    echo Elapsed call time is $(($post-$pre))\(ms\)

    unset pre
    unset post

    sleep 300

    node ../../scripts/notification-delay-times.js ${resdir}/par-runs-${parexec}-notif-delay
    node ../../scripts/full-profile-report-times.js ${resdir}/par-runs-${parexec}-prof-report

    pushd ../app

    sls remove -v

    popd

    for i in $(seq 1 ${parexec})
    do
	cat ${resdir}/e2e-${i}_of_${parexec} >> ${resdir}/e2e-${parexec}
    done
done
