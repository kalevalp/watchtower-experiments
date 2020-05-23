#! /bin/bash

for kind in {shared-props,disj-props,../scripts}
do
    echo Cleaning ${kind}

    pushd ../${kind}

    rm -rf node_modules

    popd

done
