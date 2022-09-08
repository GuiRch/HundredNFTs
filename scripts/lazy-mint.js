const SIGNING_DOMAIN_NAME = "Voucher-Domain"
const SIGNING_DOMAIN_VERSION = "1"
const chainId = 1
const contractAddress = "0x8bd23F1060E87116C1072f0190c54dFe8433438b" // Put the address here from remix
// const signer = new ethers.Wallet("cc94d883bedf9fc9b9c5ede86c12befde18b82f90a5cec1cface6851caef6be1") // private key that I use for address 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/LazyHundredNFTs.sol/LazyHundredNFTs.json");

// provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const LazyHundredNFTs = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const domain = {
  name: SIGNING_DOMAIN_NAME,
  version: SIGNING_DOMAIN_VERSION,
  verifyingContract: contractAddress,
  chainId: chainId
}

async function createVoucher(price, uri, buyer) {
  const voucher = { price, uri, buyer }
  const types = {
    LazyNFTsVoucher: [
      {name: "price", type: "uint256"},
      {name: "uri", type: "string"},
      {name: "buyer", type: "address"}
    ]
  }

  const signature = await signer._signTypedData(domain, types, voucher)
  return {
    ...voucher,
    signature
  }
}

async function main() {
  const voucher = await createVoucher(0, "uri", "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4") // the address is the address which receives the NFT
  console.log(`[${voucher.price}, "${voucher.uri}", "${voucher.buyer}", "${voucher.signature}"]`)
}

async function main() {
  const voucher = await createVoucher(2, 0, "uri", "0x664ffb4D594df5697ec670cf4148D1D85DDaF202") // the address is the address which receives the NFT
  console.log(`[${voucher.tokenId}, ${voucher.price}, "${voucher.uri}", "${voucher.buyer}", "${voucher.signature}"]`)
  const voucherTuple = [voucher.tokenId, voucher.price, voucher.uri, voucher.buyer, voucher.signature]
  const recover = await LazyHundredNFTs.recover(voucherTuple)
  console.log("the address is : " + recover )
}

main()