#!/bin/bash -u

cd `dirname $0`
cd .. && \
    yarn deploy:polygon && \
    # yarn deploy:meter && \
    # yarn deploy:rinkarby && \
    # yarn deploy:rinkeby && \
    # yarn deploy:kovan && \
    # yarn deploy:optimism && \
    yarn deploy:goerli && \
    # yarn deploy:ropsten && \
    yarn deploy:hedera && \
    ./scripts/sync-contracts.sh
