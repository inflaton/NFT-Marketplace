const dotEnv = require('dotenv-flow')
dotEnv.config()
var CollectibleNFT = artifacts.require('./CollectibleNFT.sol')

module.exports = function (deployer) {
  const name = process.env.NFT_CONTRACT_NAME
  const symbol = process.env.NFT_CONTRACT_SYMBOL
  const royaltyRecipient = process.env.ROYALTY_RECIPIENT_ADDRESS
  const royaltyValue = process.env.ROYALTY_VALUE
  const tokenBaseURL = process.env.TOKEN_BASE_URL
  deployer.deploy(CollectibleNFT, name, symbol, tokenBaseURL, royaltyRecipient, royaltyValue)
}
