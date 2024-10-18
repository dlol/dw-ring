#!/bin/sh

[ -z "$(ls -A "/dw-ring/src/static")" ] && cp -r static-tmp/* /dw-ring/src/static
[ ! -f "/dw-ring/config/config.yml" ]   && cp /dw-ring/config.yml /dw-ring/config/config.yml

node src/app.js --docker
