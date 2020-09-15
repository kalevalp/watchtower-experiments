#! /bin/bash

export resdir=$1
export API_URL=$2
export iter=$3
export total=$4

echo Calling function at url: ${API_URL}

for i in $(seq 2 50}
do
    ( time curl ${API_URL} ) 2>> ${resdir}/e2e-${iter}_of_${total} &
    sleep 0.017
done

( time curl ${API_URL} ) 2>> ${resdir}/e2e-${iter}_of_${total}
