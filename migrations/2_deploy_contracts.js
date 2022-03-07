const Auction = artifacts.require("Auction");
const AuctionFactory = artifacts.require("AuctionFactory");

module.exports = function(deployer,network,accounts) {
    deployer.then(async () => {
      await deployer.deploy(Auction);
      await deployer.deploy(AuctionFactory, Auction.address);
  }).then(async () => {
//Some test data
    let auctionFactory = await AuctionFactory.deployed();
  let accounts = await web3.eth.getAccounts()
  auctionFactory.createAuction(accounts[0], "Metrou Drumul Taberei", "Realizarea liniei de metrou", 100, 100);
  });
  
};