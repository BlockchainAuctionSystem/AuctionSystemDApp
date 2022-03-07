let auctionFactory = await AuctionFactory.deployed();
let accounts = await web3.eth.getAccounts()
auctionFactory.createAuction(accounts[0], "Metrou Drumul Taberei", "Realizarea liniei de metrou", 100, 100);
let auctions = await auctionFactory.auctions(); // Returneaza array de adrese
let auction = await Auction.at(auctions[0]);