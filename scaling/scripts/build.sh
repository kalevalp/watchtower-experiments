#! /bin/bash

for kind in {app,scripts}
do
    echo Building ${kind}

    pushd ../${kind}

    npm update
    npm install

    popd

done
