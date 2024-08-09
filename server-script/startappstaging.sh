#!/bin/bash

cd /var/www/aihomework/staging/
mkdir -p logs
/usr/bin/yarn start >> logs/stagingoutput.log 2>&1
