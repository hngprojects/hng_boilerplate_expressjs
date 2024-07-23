#!/bin/bash

cd /var/www/aihomework/prod/
/usr/bin/yarn prod >> /var/log/startappprod.log 2>&1
