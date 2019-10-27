#! /bin/bash

for kind in {app,../scripts}
do
    echo Cleaning ${kind}

    pushd ../${kind}

    rm -rf node_modules

    popd

done
