
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/HundredNFTs.sol/HundredNFTs.json");

// provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const hundredNFTs = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    const totalContent = await hundredNFTs.totalContent()
    console.log("the total of minted nfts is : " + totalContent) 
}

main();