#! /bin/bash

for kind in {loop,sleep,scripts}
do
    echo Building ${kind}

    pushd ../${kind}

    rm -rf node_modules

    popd

done
