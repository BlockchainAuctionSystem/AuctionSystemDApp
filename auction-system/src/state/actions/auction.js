import { ACTION_TYPES } from "../actionTypes";
import getWeb3 from "./../../getWeb3";
import TruffleContract from "@truffle/contract";
import AuctionFactory from '../../contracts/AuctionFactory.json';
import Auction from '../../contracts/Auction.json';
import { create } from 'ipfs-http-client'
import { DEFAULT_AUCTION_PHOTO_URL } from "../../utils/constants";

/**
 * Setup the auction's environment
 * 
 * @returns {function}
 */
const setupEnv = () => 
   async (dispatch) => {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
      // Get the contract instance.
      const auction = TruffleContract(Auction);
      auction.setProvider(web3.currentProvider);
      const auctionFactory = TruffleContract(AuctionFactory);
      auctionFactory.setProvider(web3.currentProvider);
      console.log(auctionFactory);
      // Set web3, accounts, and contract to the state
      dispatch({
          type: ACTION_TYPES.SETUP_ENV,
          payload: {
              web3,
              account: accounts[0],
              accounts,
              contracts: {auction, auctionFactory}
          }
      });
   }

/**
*  Read auctions
* 
* @param {object} contracts An object containing the contracts
* @returns {function}
*/
const readAuctions = (contracts) => 
   async (dispatch) => {
        const AuctionFactory = contracts.auctionFactory;
        AuctionFactory.deployed().then(function(instance) {
            console.log(instance);
            instance.AuctionCreated(async (err, result) => {
              if (err)
                  console.log("Error in binding listener to AuctionCreated event: " + err);
              //Bind to new auction events
              let auctionAddress = result.args._auctionAddress;
              let auctionInstance = await contracts.auction.at(auctionAddress);
              auctionInstance.HighestBidIncreased((err, result) => dispatch(handleHighestBidIncreasedEvent(err, result, auctionAddress, auctionInstance)));
              auctionInstance.AuctionEnded((err, result) => dispatch(handleAuctionEnd(err,result, auctionAddress, auctionInstance)));
              let auctionData = await getDataFromAuctionContract(auctionInstance);
              dispatch({
                type: ACTION_TYPES.ADD_AUCTION,
                payload: auctionData
               });
           });
           dispatch({
               type: ACTION_TYPES.SET_AUCTION_FACTORY,
               payload: instance
           });
           return instance.getAuctions();
        }).then(async function(auctions) {
            let auctionResult = [];
            if(auctions) {
                 let promises = auctions.map(auctionAddress => {
                    return contracts.auction.at(auctionAddress). //Bind to old auctions events too
                    then(async contract => {
    
                        let auctionInstance = await contracts.auction.at(auctionAddress);
                        //TO DO: Bind to old auctions events too
                        auctionAddress = contract.address;
                        auctionInstance.HighestBidIncreased((err, result) => dispatch(handleHighestBidIncreasedEvent(err, result, auctionAddress, auctionInstance)));
                        auctionInstance.AuctionEnded((err, result) => dispatch(handleAuctionEnd(err,result, auctionAddress, auctionInstance)));
                        return getDataFromAuctionContract(contract);
                    })
                });
                auctionResult = await Promise.all(promises);
            }
            console.log(auctionResult);
            dispatch({
                type: ACTION_TYPES.READ_AUCTIONS,
                payload: auctionResult
            });
        });
    };


/**
 * Create a new auction
 * 
 * @param {object} auctionFactoryInstance 
 * @param {object} payload Data for the new auction
 * @returns {function}
 */    
const createAuction = (auctionFactoryInstance, account, payload) => 
   async (dispatch) => {
        const {title, description, startingBid, biddingTime, image} = payload;
        if(!image) {
             auctionFactoryInstance.createAuction(account, title, description, parseInt(startingBid),
             parseInt(biddingTime), DEFAULT_AUCTION_PHOTO_URL, {
            from: account
            });
        }
        else {
                const client = create('https://ipfs.infura.io:5001/api/v0')
                const added = await client.add(image);
                const ipfsLink = `https://ipfs.infura.io/ipfs/${added.path}`
                auctionFactoryInstance.createAuction(account, title, description, 
                    parseInt(startingBid), parseInt(biddingTime), ipfsLink, {
                    from: account
                });
            };
        dispatch({
            type: ACTION_TYPES.INIT_ADD_AUCTION
        });
    };

/**
 * End an auction
 * 
 * @param {object} contracts An object containing the contracts
 * @param {string} account The account performing the action
 * @param {string} auctionId The auction's identifier
 * @returns {function}
 */    
const endAuction = (contracts, account, auctionId) => 
    async (dispatch) => {
        let auctionContract = await contracts.auction.at(auctionId);
        console.log(auctionContract);
        console.log("acution id", auctionId);
        auctionContract.ended.call().then((ended) => {
            console.log("Auction ended? : ", ended);
            if (!ended) {
                auctionContract.endAuction({
                    from: account
                });
            }
        });
    };

/**
 * Withdraw money from the bid
 * 
 * @param {object} contracts An object containing the contracts
 * @param {string} account The account performing the action
 * @param {string} auctionId The auction's identifier
 * @returns {function}
 */
const getAmount = (contracts, account, auctionId) => 
    async (dispatch) => {
        let auctionContract = await contracts.auction.at(auctionId);
        console.log(auctionId, auctionContract);
        auctionContract.withdraw({
            from: account
        });
    }; 

/**
 * Bid in an auction
 * 
 * @param {object} contracts An object containing the contracts
 * @param {string} account The account performing the action
 * @param {string} auctionId The auction's identifier
 * @param {number} bidAmount The amount bidded
 * @returns {function}
 */
const bid = (contracts, account, auctionId, bidAmount) =>
    async (dispatch) => {
        let auctionContract = await contracts.auction.at(auctionId); ///bind for the auction
        console.log("binding function: ", auctionId, bidAmount);
        console.log("auctionContract bidden", auctionContract);
        // Execute the bidding
        auctionContract.bid({
            from: account,
            value: bidAmount
        });
    }

const handleHighestBidIncreasedEvent = (err, result, auctionAddress, oldAuction) => 
     {
         console.log(result);
         return {
            type:ACTION_TYPES.UPDATE_AUCTION,
            payload: {
                auctionId: auctionAddress,
                updatedAuction: {
                        _highestBidder: result['args']['bidder'],
                        _highestBid: result['args']['amount']
                }
            }
         }
    }
const handleAuctionEnd = (err, result, auctionAddress, oldAuction) => 
        {
            return {
            type:ACTION_TYPES.UPDATE_AUCTION,
            payload: {
                auctionId: auctionAddress,
                updatedAuction: {
                 _ended: true,
                 _beneficiary: result['args']['beneficiary'],
                 _winner: result['args']['winner']}
            }
        }
    }

const getDataFromAuctionContract =  async (contract) => 
     {
        let promises = [contract.address, contract.beneficiary.call(), contract.title.call(), contract.description.call(),
            contract.startingBid.call(), contract.auctionEndTime.call(), contract.linkToImage.call(), contract.highestBid.call(),
            contract.highestBidder.call(), contract.ended.call()
        ];
        let solvedPromises = await Promise.all(promises);
        return {
            _auctionAddress: solvedPromises[0],
            _beneficiary: solvedPromises[1],
            _title: solvedPromises[2],
            _description: solvedPromises[3],
            _startingBid: solvedPromises[4],
            _biddingTime: solvedPromises[5],
            _linkToImage: solvedPromises[6],
            _highestBid: solvedPromises[7],
            _highestBidder: solvedPromises[8],
            _ended: solvedPromises[9]
        };
}
export {
  createAuction,
  setupEnv,
  readAuctions,
  bid,
  endAuction,
  getAmount
};
