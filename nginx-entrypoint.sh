#!/bin/sh
ln -s /etc/nginx/sites-available/expressjs /etc/nginx/sites-enabled/expressjs
exec nginx -g 'daemon off;'
