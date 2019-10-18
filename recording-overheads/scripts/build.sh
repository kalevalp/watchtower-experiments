#! /bin/bash

for kind in {log-events,kinesis-events,tarry-post-kinesis-events,tarry-post-log-events,tarry-pre-kinesis-events,tarry-pre-log-events}
do
    echo Building ${kind}

    pushd ../${kind}

    npm install
#    npm update

    popd
done
