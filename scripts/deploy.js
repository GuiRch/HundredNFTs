async function main() {
  const LazyHundredNFTs = await ethers.getContractFactory("LazyHundredNFTs")

  // Start deployment, returning a promise that resolves to a contract object
  const lazyHundredNFTs = await LazyHundredNFTs.deploy("0x664ffb4D594df5697ec670cf4148D1D85DDaF202")
  await lazyHundredNFTs.deployed()
  console.log("Contract deployed to address:", lazyHundredNFTs.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
