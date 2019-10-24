#! /bin/bash

for kind in {loop-once,loop-twice,loop-twice-possible-alarm,sleep-once,sleep-twice,sleep-twice-possible-alarm,scripts}
do
    echo Building ${kind}

    pushd ../${kind}

    rm -rf node_modules

    popd

done
