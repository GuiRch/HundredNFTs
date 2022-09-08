async function main() {
  const HundredNFTs = await ethers.getContractFactory("HundredNFTs")

  // Start deployment, returning a promise that resolves to a contract object
  const hundredNFTs = await HundredNFTs.deploy()
  await hundredNFTs.deployed()
  console.log("Contract deployed to address:", hundredNFTs.address)
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})