import React from 'react';
import {connect} from 'react-redux';
import {useEffect} from 'react';
import {Box, Chip} from '@mui/material';
import { readAuctions, endAuction, bid, getAmount } from '../../state/actions/auction';
import AuctionItem from '../AuctionItem';

const AuctionList = ({auctions, account, readAuctions, contracts, endAuction, bid, getAmount, filter}) => {
    let loading = true;
    useEffect(() => {
        loading = true;
    }, []);
    useEffect(() => {
        if(contracts) {
            console.log(contracts);
            readAuctions(contracts);
        }
    }, [contracts]);
    useEffect(() => {
        loading = false;
    }, [auctions])
    console.log(loading);
    const handleBid = (bidAmount, auctionAddress) => bid(contracts, account, auctionAddress, bidAmount);
    const handleEndAuction = (auctionAddress) => endAuction(contracts, account, auctionAddress);
    const handleGetAmount = (auctionAddress) => getAmount(contracts, account, auctionAddress);
    return (
    <>
      <Box sx={{mt: 10, mb: 10}}> 
        <Chip sx={{fontSize: 'body.fontSize', fontWeight: '500'}} label={`We've found ${auctions.filter(filter).length} auctions`}/>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          mt: 3,
        }}>
        
            {auctions !== [] &&
            <Box sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {auctions.filter(filter).map((auction, index) => (
                auction._biddingTime &&
                <AuctionItem
                key={index} 
                auction={auction}
                endAuction={handleEndAuction}
                bid={handleBid}
                getAmount={handleGetAmount}
                ></AuctionItem>
              ))}
            </Box>
            }
        </Box>
      </Box>
    </>
  );
};

function mapStateToProps(state) {
  return {
    contracts: state.contracts,
    auctions: state.auctions,
    account: state.account
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    readAuctions: (contracts) => dispatch(readAuctions(contracts)),
    endAuction: (contracts, account, auctionAddress) => dispatch(endAuction(contracts, account, auctionAddress)),
    bid: (contracts, account, auctionAddress, bidAmount) => dispatch(bid(contracts, account, auctionAddress, bidAmount)),
    getAmount: (contracts, account, auctionAddress) => dispatch(getAmount(contracts, account, auctionAddress))
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AuctionList);
