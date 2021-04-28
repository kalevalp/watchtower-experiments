#! /bin/bash

for kind in {single-event,../scripts}
do
    echo Cleaning ${kind}

    pushd ../${kind}

    rm -rf node_modules

    popd

done
