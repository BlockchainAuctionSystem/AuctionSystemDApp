const Auction = artifacts.require("Auction");
const AuctionFactory = artifacts.require("AuctionFactory");
// const CloneFactory = artifacts.require("CloneFactory");

module.exports = function(deployer,network,accounts) {
    deployer.then(async () => {
      await deployer.deploy(Auction);
      await deployer.deploy(AuctionFactory, Auction.address);
      // await deployer.deploy(CloneFactory);
  }).then(async () => {
//Some test data
    let auctionFactory = await AuctionFactory.deployed();
  let accounts = await web3.eth.getAccounts();
  auctionFactory.createAuction(accounts[0], "Metrou Drumul Taberei", "Realizarea liniei de metrou", 100, 100, "https://i0.wp.com/media.revistabiz.ro/uploads/2020/06/metrou_Bucuresti_Dreamstime_109419765.jpg");
  });
  
};