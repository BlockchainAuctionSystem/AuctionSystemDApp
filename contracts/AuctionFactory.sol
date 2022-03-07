// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import { Auction } from './Auction.sol';
import { CloneFactory } from './CloneFactory.sol';

//Using CloneFactory pattern to optimise gas costs
contract AuctionFactory is CloneFactory {
    Auction[] auctions;
    address masterContract; // Needed for CloneFactory

     constructor(address _masterContract) {
         masterContract = _masterContract;
     }
    event AuctionCreated(address _auctionAddress,  
    address _beneficiary,
    string _title, 
    string _description,
    uint _startingBid, 
    uint _biddingTime);
    
    function createAuction(address payable _beneficiary, 
    string calldata _title, 
    string calldata _description,
    uint _startingBid,
    uint _biddingTime) external returns(address) {
        Auction newAuction = Auction(createClone(masterContract));
        newAuction.init(_beneficiary, _title, _description, _startingBid, _biddingTime);
        auctions.push(newAuction);
        address newAuctionAddress = address(newAuction);
        emit AuctionCreated(newAuctionAddress, _beneficiary, _title, _description, _startingBid, _biddingTime);
        return newAuctionAddress;
    }

    function getAuction(uint index) external view returns(Auction){
         require(index >=0 && index <= auctions.length,  "Index out of bounds");
         return auctions[index];
     }

    function getAuctions() external view returns(Auction[] memory)
    {
        return auctions;
    }
}