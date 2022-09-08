// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LazyHundredNFTs is ERC721, ERC721URIStorage, Ownable, EIP712 {
    // Tools we need to implement the counter
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint public constant MAX_SUPPLY = 2; // Here the max number of NFTs is 2 for test purpose, if we want to have a maximum of 100 NFTs we will replace the value by 99
    string private constant SIGNING_DOMAIN = "Voucher-Domain";
    string private constant SIGNATURE_VERSION = "1";
    address public minter;

    constructor(address _minter) ERC721("LazyHundredNFTs", "LHDRD") EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        minter = _minter;
    }

    // Here is the srtucture for our Voucher
    struct LazyNFTVoucher {
        uint256 price;
        string uri;
        address buyer;
        bytes signature;
    }

    // recover garanties that the voucher have been signed correctly
    function recover(LazyNFTVoucher calldata voucher) public view returns (address) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("LazyNFTVoucher(uint256 price,string uri,address buyer)"),
            voucher.price,
            keccak256(bytes(voucher.uri)),
            voucher.buyer
        )));
        address signer = ECDSA.recover(digest, voucher.signature);
        return signer;
    }
    
    // Whoever wants to call this function needs a signed voucher
    function safeMint(LazyNFTVoucher calldata voucher)
        public
        payable
    {
        uint totalMinted = _tokenIds.current();

        // Checking that less than 100 NFTs have been minted
        require(totalMinted <= MAX_SUPPLY, "All the NFTs have been minted");
        require(minter == recover(voucher), "Wrong signature.");
        require(msg.value >= voucher.price, "Not enough ether sent.");
        // We assign the tokenId to the NFT the buyer juste bought and mint it to his address
        _safeMint(voucher.buyer, totalMinted);
        _setTokenURI(totalMinted, voucher.uri);

        // Update the new total of NFT
        _tokenIds.increment();
    }

    // Function to see how many NFTs have been minted
    function totalContent() public view virtual returns (uint256) {
        return _tokenIds.current();
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}