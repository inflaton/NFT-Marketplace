#!/bin/bash -u
cd `dirname $0`

curl -v  https://api-dev.reddio.com/v1/mints  \
    -H 'content-type: application/json' \
    -H 'X-API-Key: rk-d3294774-a408-4f32-8f70-ebca18f9960f'  \
    -d '{ "contract_address":"0x3fB44BFa72591Ff4be8bf048384b17c2fDAf9622", "stark_key":"0x5468e035879734e63e2db83ccb953bce38096590d58aa0edde4034de0806790", "amount":"1"}'

./l2-tokens.sh