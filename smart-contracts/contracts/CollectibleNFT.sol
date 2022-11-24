// contracts/CollectibleNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import './ERC2981ContractWideRoyalties.sol';

contract CollectibleNFT is ERC721Enumerable, ERC721URIStorage, AccessControl, ERC2981ContractWideRoyalties {

    address public contractOwner;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address public constant prodOperatorAddress = 0xB62BcD40A24985f560b5a9745d478791d8F1945C;
    address public constant testOperatorAddress = 0x8Eb82154f314EC687957CE1e9c1A5Dc3A3234DF9;

    string _baseTokenURI;
    
    constructor(string memory name_, 
        string memory symbol_, 
        string memory baseURI,
        address royaltyRecipient,
        uint256 royaltyValue) 
            ERC721(name_, symbol_) {
        _setRoyalties(royaltyRecipient, royaltyValue);
        _setupRole(ADMIN_ROLE, msg.sender);
        contractOwner = msg.sender;
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public {
        require(
            hasRole(ADMIN_ROLE, _msgSender()),
            "CollectibleNFT: must have admin role"
        );
        _baseTokenURI = baseURI;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC2981Base, AccessControl)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    modifier onlyOperator() {
        require((msg.sender == contractOwner) ||
            (msg.sender == prodOperatorAddress) ||
            (msg.sender == testOperatorAddress), 
            "only contract owner or operator can call mintFor");
        _;
    }

    function bytesToUint(bytes memory b) internal pure returns (uint256){
        uint256 number;
        for (uint i = 0; i < b.length; i++) {
            number = number + uint(uint8(b[i])) * (2 ** (8 * (b.length - (i + 1))));
        }
        return number;
    }

    // amount for later use
    function mintFor(address player, uint256, bytes calldata mintingBlob)
        public
        onlyOperator
        returns (uint256) {
        uint256 tokenId = bytesToUint(mintingBlob);
        _mint(player, tokenId);

        return tokenId;
    }
}