#!/bin/bash -u

echo Orders:
curl https://api-dev.reddio.com/v1/orders?contract_address=0x3fB44BFa72591Ff4be8bf048384b17c2fDAf9622 | jq
