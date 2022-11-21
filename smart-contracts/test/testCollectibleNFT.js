let CollectibleNFT = artifacts.require('./CollectibleNFT.sol')

contract('CollectibleNFT', function (accounts) {
  let testContract = null // store the CollectibleNFT contract instance
  const [contractOwner, royaltyRecipient, buyer1] = accounts;
  const txParams = { from: contractOwner };
  const royaltyValue = 250;

  beforeEach(async function () {
    this.testContract = await CollectibleNFT.new("Test NFT", "TNFT", "http://localhost/", royaltyRecipient, royaltyValue);
  });

  it('has right contract owner and royaltyInfo', async function () {
    expect(await this.testContract.contractOwner()).to.equal(contractOwner);

    const tokenId = 123;
    const result = await this.testContract.mintFor(buyer1, 0, tokenId, txParams);
    // console.log(JSON.stringify(result, 0, 2));
    expect(result.receipt.logs[0].args.tokenId.toNumber()).to.equal(tokenId);

    const royaltyInfo = await this.testContract.royaltyInfo(tokenId, 10000);
    // console.log(JSON.stringify(royaltyInfo, 0, 2));
    expect(royaltyInfo.receiver).to.equal(royaltyRecipient);
    expect(royaltyInfo.royaltyAmount.toNumber()).to.equal(royaltyValue);

    const tokenURI = await this.testContract.tokenURI(tokenId);
    expect(tokenURI).to.equal(`http://localhost/${tokenId}`);
  });

}) // end CollectibleNFT contract
