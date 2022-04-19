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
        $(document).on('click', '#end-auction', App.endAuction);
        $(document).on('click', '#get-money', App.getAmount);
    },

    createAuction: async function(event) {
        event.preventDefault();
        const title = $("#auction-name").val();
        const description = $("#auction-desc").val();
        const time = $("#auction-duration").val();
        const startBid = $("#starting-bid").val();
        const img = $("#img").val();



        const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', {
            protocol: 'https'
        });
        if (!img) {
            App.auctionFactoryInstance.createAuction(App.account, title, description, parseInt(startBid), parseInt(time), "https://media.istockphoto.com/photos/gavel-on-auction-word-picture-id917901978?k=20&m=917901978&s=612x612&w=0&h=NULGu8-bVpy28gbW6AZbZlEVra-Q4s2rg607emPfkCs=", {
                from: App.account
            });
        } else {

            const file = document.getElementById("img").files[0]; //File Object

            let read = new FileReader();
            read.readAsArrayBuffer(file);
            read.onloadend = function() {
                const fileContent = read.result; //fileContent string
                const fileBuffer = buffer.Buffer.from(fileContent); //Buffer from string
                ipfs.add(fileBuffer, (err, result) => {
                    let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
                    App.auctionFactoryInstance.createAuction(App.account, title, description, parseInt(startBid), parseInt(time), ipfsLink, {
                        from: App.account
                    });
                });
            };
        }

        $("#create-form")[0].reset();
        $("#file-preview").attr('src', "");
    },

    endAuction: async function(event) {
        event.preventDefault();
        auctionId = $(event.target).attr("data-id");
        let auctionContract = App.contracts.Auction.at(auctionId);
        console.log(auctionContract);
        console.log("acution id", auctionId);
        auctionContract.ended.call().then((ended) => {
            console.log("Auction ended? : ", ended);
            if (!ended) {
                auctionContract.endAuction({
                    from: App.account
                });
            }
        });
    },


    getAmount: async function(event) {
        event.preventDefault();
        auctionId = $(event.target).attr("data-id");
        let auctionContract = App.contracts.Auction.at(auctionId);
        console.log(auctionId, auctionContract);
        auctionContract.withdraw({
            from: App.account
        });

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

        App.contracts.AuctionFactory.deployed().then(function(instance) {
            App.auctionFactoryInstance = instance;
            console.log(instance);
            App.auctionFactoryInstance.AuctionCreated().watch(function(err, result) {
                if (err)
                    console.log("Error in binding listener to AuctionCreated event: " + err);
                //Bind to new auction events
                auctionAddress = result.args._auctionAddress;
                let auctionInstance = App.contracts.Auction.at(auctionAddress);
                console.log("args ", result['args'])

                App.createFront(result['args']);
                
                auctionInstance.HighestBidIncreased().watch((err, result) => App.handleHighestBidIncreasedEvent(err, result, auctionAddress));
                auctionInstance.AuctionEnded().watch((err, result) => App.handleAuctionEnd(err,result, auctionAddress));
            });
            return instance.getAuctions();
        }).then(async function(auctions) {
            console.log("Got " + auctions.length + " auctions");
            var promises = auctions.map(auctionAddress => {
                return App.contracts.Auction.at(auctionAddress). //Bind to old auctions events too
                then(contract => {

                    let auctionInstance = App.contracts.Auction.at(auctionAddress);

                    //TO DO: Bind to old auctions events too
                    auctionAddress = contract.address;
                    auctionInstance.HighestBidIncreased().watch((err, result) => App.handleHighestBidIncreasedEvent(err, result, auctionAddress));
                    auctionInstance.AuctionEnded().watch((err, result) => App.handleAuctionEnd(err,result, auctionAddress));

                    return App.getDataFromAuctionContract(contract);
                })
            });
            var auctionsData = await Promise.all(promises);
            auctionsData.forEach(data => {
                    if (!data["_ended"]) {
                        App.createFront(data);
                    }
                    else {
                        App.createFrontForFinishedAuction(data);

                    }
            });
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    handleHighestBidIncreasedEvent : function(err, result, auctionAddress) {
            if (err)
                console.log("Error in binding listener to HighestBidIncreased event: " + err);

            //Update front-end data
            console.log("bid event catched");
            App.updateFrontEndForBidData(result['args'], auctionAddress);
    },

    handleAuctionEnd: function(err, result, auctionAddress) {
        if (err)
            console.log("Error in binding listener to HighestBidIncreased event: " + err);

        console.log("Auction ended");
        //update data & front-end
        console.log(result['args']);
        console.log(auctionAddress);
        let results = result['args'];
        data = {};
        data['_auctionAddress'] = auctionAddress;
        data['_beneficiary'] = results["beneficiary"];
        data['_title'] = results["title"];
        data['_description'] = results["description"];
        data['_startingBid'] = results["startingBid"];
        data['_biddingTime'] = results["biddingTime"];
        data['_linkToImage'] = results["linkToImage"];
        data['_highestBid'] = results['highestBid'];
        data['_highestBidder'] = results['highestBidder'];
    
           
        App.createFrontForFinishedAuction(data);
        App.removeFinishedAcutionFromAuctionsRow(data["_auctionAddress"]);
    },

    handleBid: async function(event) {
        event.preventDefault();
        const html = $(event.target);
        const auctionId = html.find('.auction-address').text();
        const bidAmount = parseInt(html.find('#bid-amount').val());

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
                console.log("Acc error");
            }

            var account = accounts[0];
            let auctionContract = App.contracts.Auction.at(auctionId); ///bind for the auction
            console.log("binding function: ", auctionId, bidAmount);
            console.log("auctionContract bidden", auctionContract);
            // Execute the bidding
            auctionContract.bid({
                from: account,
                value: bidAmount
            });
        });
    },

    getDataFromAuctionContract: async function(contract) {
        var data = {};
        var promises = [contract.address, contract.beneficiary.call(), contract.title.call(), contract.description.call(),
            contract.startingBid.call(), contract.auctionEndTime.call(), contract.linkToImage.call(), contract.highestBid.call(),
            contract.highestBidder.call(), contract.ended.call()
        ];
        solvedPromises = await Promise.all(promises);
        data['_auctionAddress'] = solvedPromises[0];
        data['_beneficiary'] = solvedPromises[1];
        data['_title'] = solvedPromises[2];
        data['_description'] = solvedPromises[3];
        data['_startingBid'] = solvedPromises[4];
        data['_biddingTime'] = solvedPromises[5];
        data['_linkToImage'] = solvedPromises[6];
        if (solvedPromises[7] === 0) {
            data['_highestBid'] = 'No one has bidden yet.'
            data['_highestBidder'] = 'No one has bidden yet.'
        } else {
            data['_highestBid'] = solvedPromises[7];
            data['_highestBidder'] = solvedPromises[8];
        }
        data['_ended'] = solvedPromises[9];


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

        if (App.account === data['_beneficiary']) {
            auctionTemplate.find("#end-auction").show();
            auctionTemplate.find("#end-auction").attr("data-id", data['_auctionAddress']);
        }

        auctionsRow.append(auctionTemplate.html());

    },

    updateFrontEndForBidData: function(data, auctionId) {
        console.log("Update data for bid in auction");
        $('#auctionsRow .col-sm-6.col-md-4.col-lg-3').each(function() {
            console.log($(this).find('.auction-address').text(), auctionId);
            if ($(this).find('.auction-address').text() === auctionId) { //update only the bidding auction
                $(this).find('.highest-bidder').text(data['bidder']);
                $(this).find('.auction-bid').text(data['amount']);
                $(this).find('#bid-form')[0].reset();

            }
        })

    },

    createFrontForFinishedAuction: function(data) {
        console.log("Created Finished auction");
        var finishedAuctionsRow = $('#finisedAuctionsRow');
        var auctionTemplate = $('#finisedAuctionTemplate');
        auctionTemplate.find('.panel-title').text(data['_title']);
        auctionTemplate.find('.auction-seller').text(data['_beneficiary']);
        auctionTemplate.find('.auction-description').text(data['_description']);
        auctionTemplate.find('img').attr('src', data['_linkToImage']);
        auctionTemplate.find('.winner').text(data['_highestBidder']);
        auctionTemplate.find('.highest-bid').text(data['_highestBid']);

        auctionTemplate.find("#get-money").show();
        console.log(data['_auctionAddress']);
        auctionTemplate.find("#get-money").attr("data-id", data['_auctionAddress']);

        finishedAuctionsRow.append(auctionTemplate.html());
    },

    removeFinishedAcutionFromAuctionsRow: function(auctionId) {
        console.log("Remove ended auction from bidding actions");
        $('#auctionsRow .col-sm-6.col-md-4.col-lg-3').each(function() {
            if ($(this).find('.auction-address').text() === auctionId) {
                $(this).remove();
            }
        })

    }

};


$(function() {
    $(window).load(function() {
        App.init();
    });
});
