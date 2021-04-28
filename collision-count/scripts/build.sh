#! /bin/bash

for kind in {single-event,../scripts}
do
    echo Building ${kind}

    pushd ../${kind}

    npm install

    popd

done
