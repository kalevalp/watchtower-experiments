#! /bin/bash

for kind in {loop-kinesis,loop-log,regular-kinesis,regular-log,tarry-kinesis,tarry-log}
do
    echo Building ${kind}
    pushd ../${kind}
#    npm update
     npm install
    popd
done
