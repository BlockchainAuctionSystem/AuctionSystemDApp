# :moneybag::moneybag: Blockchain Auction System :moneybag::moneybag:

## :hammer: Setting up the development environment

- [Ganache](https://trufflesuite.com/ganache)
- [MetaMask](https://metamask.io/)
 
```
npm install -g truffle
```

To run the DApp (make sure MetaMask is connected to the Ganache network if you want to create auctions / bid):
```
truffle migrate --reset //Compiles and deploys contracts to the blockchain
npm run 
```

To run tests:
```
truffle tests
```

## :notebook: TO DO: 
- [ ] Fix "Invalid Address" bug when trying to create new auction from front end
- [ ] Find a good way to call the endAuction() contract function (probably before bidding and when loading auctions)
- [ ] Subscribe + Handle events defined in the Auction contract.
- [ ] Find a way to store images (Worth looking into: https://docs.ipfs.io/how-to/websites-on-ipfs/single-page-website, we could upload the file there and store the link in the auction contract)

## :chart: Could improve:
- [ ] UI
- [ ] Sorting / Filtering Auctions
