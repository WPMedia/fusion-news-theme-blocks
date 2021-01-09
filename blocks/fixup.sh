#!/bin/bash

for d in */ ; do
    echo "$d/package.json"
    cat  "$d/package.json"   | jq '( .repository.url, .name, .homepage) |= sub("wpmedia";"mentor-medier";"gi")'  | sponge  "$d/package.json"   
done