#! /bin/bash

export resdir=results$(date +%Y%m%d%H%M%S)
mkdir "${resdir}"

echo '#####################################################'
echo '#######' Running collision count microbenchmark '#######'
echo '#######  ' output dir is ${resdir}         '#######'
echo '#####################################################'

pushd ../single-event || exit
#
#sls deploy
#sleep 60

for repeat in $(seq 1 10)
do
#  for rate in {1,2,4,5,8,10,20,40}
#  for rate in {1,2,5,10,25,50}
  for rate in {1,2,3,4,5,6,10,12,15,20,30,60}
  do
    export iterations=$(( 60 / "$rate" ))
    API_URL=$(serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'); export API_URL=$API_URL/microbmark

    echo '########'
    echo '######' Running repeat "${repeat}" with rate "${rate}"
    echo '######'   Starting "${iterations}" iterations of "${rate}" concurrent invocations
    echo '########'

    for i in $(seq 1 "${iterations}")
    do
      for j in $(seq 1 "${rate}")
      do
        curl -X POST -d "110" "${API_URL}" &
      done
      for job in $(jobs -p)
      do
        wait "$job" || echo Failed job "$job"
      done
      echo
    done

    sleep 30

#    echo '######' Sleeping for around 17 mins to ensure correct collection in case of timeout
#    sleep 1000

    echo '######' Reunning report collection script
    node ../../scripts/get-collision-report.js ../scripts/${resdir}/collision-report-${rate}-repeat-${repeat} ${rate}

    echo '######' Clearing deployment in prep for the next iteration
    node ../../scripts/clear-deployment.js

    sleep 30
  done
done

#sls remove

popd || exit

echo '####################'
echo '#######' Done '#######'
echo '####################'
