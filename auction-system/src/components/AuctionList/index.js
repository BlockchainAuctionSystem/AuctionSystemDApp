import React from 'react';
import {connect} from 'react-redux';
import {useEffect} from 'react';
import {Box} from '@mui/material';
import { readAuctions, endAuction, bid } from '../../state/actions/auction';
import AuctionDetail from '../AuctionDetail';

const AuctionList = ({auctions, account, readAuctions, contracts, endAuction, bid}) => {
    useEffect(() => {
        if(contracts) {
            console.log(contracts);
            readAuctions(contracts);
        }
        }, [contracts]);
    const handleBid = (bidAmount, auctionAddress) => bid(contracts, account, auctionAddress, bidAmount);
    const handleEndAuction = (auctionAddress) => 
    { 
      return endAuction(contracts, account, auctionAddress);
    };
    return (
    <>
      <Box>
        <Box sx={{fontSize: 'body.fontSize'}}>{auctions.filter(auction => !auction._ended).length} available auctions</Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          mt: 12,
        }}>
          <div>
            {auctions !== [] &&
            <Box sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
            }}>
              {auctions.filter(auction => !auction._ended).map((auction, index) => (
                <AuctionDetail 
                key={index} 
                auction={auction}
                endAuction={handleEndAuction}
                bid={handleBid}
                ></AuctionDetail>
              ))}
            </Box>
            }
          </div>
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
    bid: (contracts, account, auctionAddress, bidAmount) => dispatch(bid(contracts, account, auctionAddress, bidAmount))
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AuctionList);
