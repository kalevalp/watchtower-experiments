#! /bin/bash

for kind in {loop,sleep,scripts}
do
    echo Building ${kind}

    pushd ../${kind}

    # npm update
    npm install

    popd

done
