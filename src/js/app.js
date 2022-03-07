App = {
    web3Provider: null,
    contracts: {},
    auctionFactoryInstance: null,
    account: null,
    init: async function() {
        console.log("Initializing DApp...");
        return await App.initWeb3();
    },

    initWeb3: async function() {
        // Modern Dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.request({
                    method: "eth_requestAccounts"
                });;
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContracts();
    },

    initContracts: function() {
       
        $.getJSON('Auction.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            var AuctionArtifact = data;
            App.contracts.Auction = TruffleContract(AuctionArtifact);

            // Set the provider for our contract
            App.contracts.Auction.setProvider(App.web3Provider);
        });
        $.getJSON('AuctionFactory.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            var AuctionFactoryArtifact = data;
            App.contracts.AuctionFactory = TruffleContract(AuctionFactoryArtifact);

            // Set the provider for our contract
            App.contracts.AuctionFactory.setProvider(App.web3Provider);
            // Use our contract to retrieve auctions
            return App.loadAuctions();
        });
        
        return App.bindEvents();
    },

    bindEvents: async function() {
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{
                eth_accounts: {}
            }]
        });
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            console.log("Available accounts:" + accounts);
            App.account = accounts[0];
            console.log("Using account: " + App.account);
        });
        $(document).on('click', '.btn-bid', App.handleBid);
        $(document).on('click', '.btn-auction', App.createAuction);
    },

    createAuction: async function(event) {
        event.preventDefault();
        //TO DO: Call the function with params from form
        App.auctionFactoryInstance.createAuction(App.account, "Created New From Frontend", "Realizarea liniei de metrou", 100, 100, "https://i0.wp.com/media.revistabiz.ro/uploads/2020/06/metrou_Bucuresti_Dreamstime_109419765.jpg", {from: App.account});

    },


    loadAuctions: function() {
        // Get auctions from the factory, subscribe to events
        // For the factory
        // event AuctionCreated(address _auctionAdress,  address _beneficiary, string _title, 
        // string _description,
        // uint _startingBid, 
        // uint _biddingTime);
        //
        // For each auction: 
        // event HighestBidIncreased(address bidder, uint amount);
        // event AuctionEnded(address winner, uint amount);

        console.log("Loading auctions...");
        App.contracts.AuctionFactory.deployed().then(function(instance) {
            App.auctionFactoryInstance = instance;
            console.log("Got auctionFactory instance");
            App.auctionFactoryInstance.AuctionCreated().watch(function(err, result) {
                if(err)
                console.log("Error in binding listener to AuctionCreated event: " + err);
                //TO DO: Bind to new auction events
                console.log("Bound listener to event AuctionCreated event");
                App.createFront(result['args']);
            });
            return instance.getAuctions();
        }).then(async function(auctions) {
            console.log("Got " + auctions.length + " auctions");
            var promises = auctions.map(auctionAddress => {
                return App.contracts.Auction.at(auctionAddress). //TO DO: Bind to old auctions events too
                then(contract => {
                    //TO DO: Bind to old auctions events too
                    console.log(contract);
                    //Could call here but would require user to pay the transaction contract.endAuction({from: App.account});
                    return App.getDataFromAuctionContract(contract);})
            });
            var auctionsData = await Promise.all(promises);
            auctionsData.forEach(data => {
                App.createFront(data);
            });
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    handleBid: function(event) {
        event.preventDefault();
        //TO DO: Get auction address
        // let auctionContract = await Auction.at(auction);
        //Call the bid function
        var auctionId = parseInt($(event.target).data('id'));
        var bidAmount = parseInt($("form").eq(auctionId).find("#bid-amount").val());
        console.log(auctionId, bidAmount);
        var auctionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
                console.log("Acc error");
            }

            var account = accounts[0];

            App.contracts.Auction.deployed().then(function(instance) {
                auctionInstance = instance;

                // Execute the bidding
                return auctionInstance.bid({
                    from: account,
                    value: bidAmount
                });
            }).then(function(result) {
                return App.loadAuctions();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    },

    getDataFromAuctionContract: async function(contract) {
        var data = {};
        var promises = [contract.address, contract.beneficiary.call(), contract.title.call(), contract.description.call(), contract.startingBid.call(), contract.auctionEndTime.call(), contract.linkToImage.call()];
        solvedPromises = await Promise.all(promises);
        data['_auctionAddress'] = solvedPromises[0];
        data['_beneficiary'] = solvedPromises[1];
        data['_title'] = solvedPromises[2];
        data['_description'] = solvedPromises[3];
        data['_startingBid'] = solvedPromises[4];
        data['_biddingTime'] = solvedPromises[5];
        data['_linkToImage'] = solvedPromises[6];
        return data;

    },
    createFront: function(data) {
        console.log("Created auction");
        var auctionsRow = $('#auctionsRow');
        var auctionTemplate = $('#auctionTemplate');
        auctionTemplate.find('.panel-title').text(data['_title']);
        auctionTemplate.find('.auction-address').text(data['_auctionAddress']);
        auctionTemplate.find('.auction-seller').text(data['_beneficiary']);
        auctionTemplate.find('.auction-starting-bid').text(data['_startingBid']);
        auctionTemplate.find('.auction-description').text(data['_description']);
        auctionTemplate.find('.auction-end-time').text(data['_biddingTime']);
        auctionTemplate.find('img').attr('src',data['_linkToImage']);
        auctionsRow.append(auctionTemplate.html());
    }

};


$(function() {
    $(window).load(function() {
        App.init();
    });
});