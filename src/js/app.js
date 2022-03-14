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
        // await window.ethereum.request({
        //     method: "wallet_requestPermissions",
        //     params: [{
        //         eth_accounts: {}
        //     }]
        // });
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            console.log("Available accounts:" + accounts);
            App.account = accounts[0];
            console.log("Using account: " + App.account);
        });
        $(document).on('click', '.btn-auction', App.createAuction);
        $(document).on('submit', '#bid-form', App.handleBid);
    },

    createAuction: async function(event) {
        event.preventDefault();
        const title = $("#auction-name").val(); 
        const description = $("#auction-desc").val();
        const time = $("#auction-duration").val();
        const startBid = $("#starting-bid").val();
        const img = $("#img").val();

        const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });
        if(!img) {
            console.log("Using default image");
            App.auctionFactoryInstance.createAuction(App.account, title, description, parseInt(startBid), parseInt(time), "https://media.istockphoto.com/photos/gavel-on-auction-word-picture-id917901978?k=20&m=917901978&s=612x612&w=0&h=NULGu8-bVpy28gbW6AZbZlEVra-Q4s2rg607emPfkCs=", {from: App.account});
        }
        else {
           
            const file = document.getElementById("img").files[0]; //File Object

            let read = new FileReader();
            read.readAsArrayBuffer(file);
            read.onloadend = function(){
                const fileContent = read.result; //fileContent string
                const fileBuffer = buffer.Buffer.from(fileContent); //Buffer from string
                ipfs.add(fileBuffer, (err, result) => {
                    let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
                    console.log("Ipfs link for uploaded img: ", ipfsLink);
                     App.auctionFactoryInstance.createAuction(App.account, title, description, parseInt(startBid), parseInt(time), ipfsLink, {from: App.account});
                });
            };
           // read.readAsArrayBuffer(file);
        }

       

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
                console.log(result);
                auctionAddress = result.args._auctionAddress;
                App.contracts.Auction.at(auctionAddress).HighestBidIncreased().watch(
                    function(err, result) {
                        if(err)
                        console.log("Error in binding listener to HighestBidIncreased event: " + err);
                        
                        //update data & front-end
                        data = getDataFromAuctionContract(result['args'])
                        App.createFront(data);

                })
                App.contracts.Auction.at(auctionAddress).AuctionEnded().watch(
                    function(err, result) {
                        if(err)
                        console.log("Error in binding listener to HighestBidIncreased event: " + err);
                        
                        //update data & front-end
                        data = getDataFromAuctionContract(result['args'])
                        App.createFrontForFinishedAuction(data);

                })
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
                    auctionAddress = contract.address;
                    App.contracts.Auction.at(auctionAddress).HighestBidIncreased().watch(
                        function(err, result) {
                            if(err)
                            console.log("Error in binding listener to HighestBidIncreased event: " + err);
                            
                            //update data & front-end
                            data = getDataFromAuctionContract(result['args'])
                            App.createFront(data);
    
                    })
                    App.contracts.Auction.at(auctionAddress).AuctionEnded().watch(
                        function(err, result) {
                            if(err)
                            console.log("Error in binding listener to HighestBidIncreased event: " + err);
                            
                            //update data & front-end
                            data = getDataFromAuctionContract(result['args'])
                            App.createFrontForFinishedAuction(data);
    
                    })
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
        const html = $(event.target);
        const auctionId = html.find('.auction-seller').text();
        const bidAmount = parseInt(html.find('#bid-amount').val());
        console.log(auctionId, bidAmount);
        var auctionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
                console.log("Acc error");
            }

            var account = accounts[0];
            let auctionContract = App.contracts.Auction.at(auctionId); ///bind for the auction
                // Execute the bidding
                auctionContract.bid({
                    from: account,
                    value: bidAmount
                });
            

            //return App.loadAuctions();
            });
    },

    getDataFromAuctionContract: async function(contract) {
        var data = {};
        var promises = [contract.address, contract.beneficiary.call(), contract.title.call(), contract.description.call(),
             contract.startingBid.call(), contract.auctionEndTime.call(), contract.linkToImage.call(), contract.highestBid.call(),
             contract.highestBidder.call()];
        solvedPromises = await Promise.all(promises);
        data['_auctionAddress'] = solvedPromises[0];
        data['_beneficiary'] = solvedPromises[1];
        data['_title'] = solvedPromises[2];
        data['_description'] = solvedPromises[3];
        data['_startingBid'] = solvedPromises[4];
        data['_biddingTime'] = solvedPromises[5];
        data['_linkToImage'] = solvedPromises[6];
        data['_highestBid'] = solvedPromises[7];
        data['_highestBidder'] = solvedPromises[8];

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
        auctionTemplate.find('img').attr('src', data['_linkToImage']);
        auctionTemplate.find('.highest-bidder').text(data['_highestBidder']);
        auctionTemplate.find('.auction-bid').text(data['_highestBid']);

        auctionsRow.append(auctionTemplate.html());
    },

    createFrontForFinishedAuction: function(data) {
        console.log("Created auction");
        var finishedAuctionsRow = $('#finisedAuctionsRow');
        var auctionTemplate = $('#finisedAuctionTemplate');
        auctionTemplate.find('.panel-title').text(data['_title']);
        auctionTemplate.find('.auction-address').text(data['_auctionAddress']);
        auctionTemplate.find('.auction-seller').text(data['_beneficiary']);
        auctionTemplate.find('.auction-starting-bid').text(data['_startingBid']);
        auctionTemplate.find('.auction-description').text(data['_description']);
        auctionTemplate.find('img').attr('src', data['_linkToImage']);
        auctionTemplate.find('.highest-bidder').text(data['_highestBidder']);
        auctionTemplate.find('.auction-bid').text(data['_highestBid']);

        finishedAuctionsRow.append(auctionTemplate.html());
    }

};


$(function() {
    $(window).load(function() {
        App.init();
    });
});