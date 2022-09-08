// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HundredNFTs is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // We choose to create a maximum of 100 NFTs for 0.001 eth each
    uint public constant MAX_SUPPLY = 100;
    uint public constant PRICE = 0.001 ether;

    // Events
    event NewItem(address recipient, uint256 tokenID);

    constructor() ERC721("HundredNFTs", "HDRD") {}

    function mintNFT(address recipient, string memory tokenURI)
        public payable
        returns (uint256)
    {
        // Looking the number of NFTs minted yet
        uint totalMinted = _tokenIds.current();

        // Checking that less than 100 NFTs have been minted
        require(totalMinted <= MAX_SUPPLY, "All the NFTs have been minted");
        // Checking that the client have sent enought eth
        require(msg.value >= PRICE, "Not enough ether to purchase NFTs.");

        // Process for minting the NFT :
        // The future id of our NFT 
        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        // Update the new total of NFT
        _tokenIds.increment();

        return newItemId;
    }

    // Function to see how many NFTs have been minted
    function totalContent() public view virtual returns (uint256) {
        return _tokenIds.current();
    }


    // Function to collect the eth gathered on this contract
    // Only accessible for the owner, the adress who deployed this contract
    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }
}