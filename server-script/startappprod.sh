#!/bin/bash

cd /var/www/aihomework/prod/
/usr/bin/yarn start >> /var/log/startappprod.log 2>&1
