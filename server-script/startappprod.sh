#!/bin/bash

cd /var/www/aihomework/prod/
mkdir -p logs
/usr/bin/yarn prod >> logs/prodoutput.log 2>&1
