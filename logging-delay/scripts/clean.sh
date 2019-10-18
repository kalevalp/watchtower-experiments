#! /bin/bash

for kind in {loop-kinesis,loop-log,regular-kinesis,regular-log,tarry-kinesis,tarry-log}
do
    echo Cleaning ${kind}
    pushd ../${kind}
    rm -rf node_modules
    popd
done
