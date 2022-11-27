#!/bin/bash -u

echo Balances:
curl 'https://api-dev.reddio.com/v1/balances?stark_key=0x5468e035879734e63e2db83ccb953bce38096590d58aa0edde4034de0806790&page=1&limit=100' | jq