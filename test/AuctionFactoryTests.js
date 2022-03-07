const AuctionFactory = artifacts.require("AuctionFactory");
const Auction = artifacts.require("Auction");

contract("AuctionFactory", function (accounts) {
    it("Should assert true when deployed", async function () {
      await AuctionFactory.deployed();
      return assert.isTrue(true);
    });
  
    describe("Function createAuction()", async () => {
      let factory;
      beforeEach(async ()=>{
        factory = await AuctionFactory.deployed();
      });
  
      it("Should create new Auctions", async () => {
        await factory.createAuction(accounts[0], "Metrou Drumul Taberei", "Realizarea liniei de metrou", 100, 100); //Time is in seconds
        await factory.createAuction(accounts[1], "Tanc Rusesc", "Nu bate nu troncane", 100, 100);
        await factory.createAuction(accounts[2], "Masti COVID-19", "Furnizarea mastilor pentru Spitalul Elias", 100, 100);
        const children = await factory.getAuctions();

        const child1 = await Auction.at(children[0]);
        const child2 = await Auction.at(children[1]);
        const child3 = await Auction.at(children[2]);
  
        const child1Data = await child1.beneficiary();
        const child2Data = await child2.beneficiary();
        const child3Data = await child3.beneficiary();
  
        assert.equal(children.length, 3);
        assert.equal(child1Data, accounts[0]);
        assert.equal(child2Data, accounts[1]);
        assert.equal(child3Data, accounts[2]);
  
      });
    });
  });