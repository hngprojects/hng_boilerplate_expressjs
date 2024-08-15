#!/bin/bash

cd /var/www/aihomework/boilerplates/dev/
mkdir -p logs
/usr/bin/yarn start >> logs/devoutput.log 2>&1
