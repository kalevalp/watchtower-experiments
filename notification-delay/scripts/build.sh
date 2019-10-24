#! /bin/bash

for kind in {loop-once,loop-twice,loop-twice-possible-alarm,sleep-once,sleep-twice,sleep-twice-possible-alarm,scripts}
do
    echo Building ${kind}

    pushd ../${kind}

    npm update
    # npm install

    popd

done
