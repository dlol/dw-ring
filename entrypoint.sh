#!/bin/sh

[ -z "$(ls -A "/dw-ring/src/static")" ] && mv static-tmp/* /dw-ring/src/static && rm -rf static-tmp
[ ! -f "/dw-ring/config/config.yml" ]   && mv /dw-ring/config.yml /dw-ring/config/config.yml

node src/app.js --docker
