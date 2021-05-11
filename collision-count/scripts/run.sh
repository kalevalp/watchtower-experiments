#! /bin/bash

export resdir=results$(date +%Y%m%d%H%M%S)
mkdir "${resdir}"

echo '#####################################################'
echo '#######' Running collision count microbenchmark '#######'
echo '#######  ' output dif is ${resdir}         '#######'
echo '#####################################################'

pushd ../single-event || exit

for rate in {10,25,50,100}
do

    echo '########'
    echo '######' Running with rate "${rate}"
    echo '########'

    sls deploy
    sleep 60

    API_URL=$(serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'); export API_URL=$API_URL/microbmark

    for i in $(seq 1 "${rate}")
    do
        curl -X POST -d "110" "${API_URL}" &
    done

    for job in $(jobs -p)
    do
    echo "$job"
      wait "$job" || echo Failed job "$job"
    done

    sleep 60

    node ../../scripts/get-collision-report.js ../scripts/${resdir}/collision-report-${rate}

    sls remove

sleep 60

done

popd || exit


echo '####################'
echo '#######' Done '#######'
echo '####################'
