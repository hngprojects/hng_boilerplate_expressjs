#!/bin/bash

cd /var/www/aihomework/boilerplate/prod/
mkdir -p logs
/usr/local/bin/yarn start >> logs/prodoutput.log 2>&1
