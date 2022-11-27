#!/bin/bash -u

echo Tokens:
curl https://api-dev.reddio.com/v1/contracts/0x3fB44BFa72591Ff4be8bf048384b17c2fDAf9622/tokens | jq
