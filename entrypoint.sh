#!/bin/sh

[ -f "/dw-ring/config/static" ] && ln -s /dw-ring/src/static /dw-ring/config/static

[ ! -f "/dw-ring/config/config.yml" ] && mv /dw-ring/config.yml /dw-ring/config/config.yml

node src/app.js --docker
