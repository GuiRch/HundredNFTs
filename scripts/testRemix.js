const SIGNING_DOMAIN_NAME = "Voucher-Domain"
const SIGNING_DOMAIN_VERSION = "1"
const chainId = 1
const contractAddress = "0x9C9fF5DE0968dF850905E74bAA6a17FED1Ba042a" // Put the address here from remix
const signer = new ethers.Wallet("7e5bfb82febc4c2c8529167104271ceec190eafdca277314912eaabdb67c6e5f") // private key that I use for address 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

const domain = {
  name: SIGNING_DOMAIN_NAME,
  version: SIGNING_DOMAIN_VERSION,
  verifyingContract: contractAddress,
  chainId: chainId
}

async function createVoucher(price, uri, buyer) {
  const voucher = { price, uri, buyer }
  const types = {
    LazyNFTVoucher: [
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

main()