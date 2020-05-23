#! /bin/bash

for kind in {shared-props,disj-props,../scripts}
do
    echo Building ${kind}

    pushd ../${kind}

    npm install

    popd

done
