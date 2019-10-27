#! /bin/bash

for kind in {app,scripts}
do
    echo Building ${kind}

    pushd ../${kind}

    rm -rf node_modules

    popd

done
