import React, { useState } from 'react';
import {Button, Paper, Box} from '@mui/material';
import { formatDate } from '../../utils/functions';
import { PaperStyle } from '../../utils/constants';

const AuctionDetail = (props) => {
   const { auction, endAuction, bid, getAmount} = props;
   const {month, day, dayHour} = formatDate(auction._biddingTime.toNumber());
   const [bidAmount, setBidAmount] = useState(100);
   console.log(auction._linkToImage);
   return (
    <>
      <Paper sx={PaperStyle} style={{width: '1100px'}}>
        <div>
          <Box>{month} {day}</Box>
          <Box sx={{
            typography: 'subtitle2',
            fontWeight: 'light',
            color: 'text.secondary',
          }}>
            {dayHour}
          </Box>
        </div>
        <img style={{width: '300px', height: '300px'}} src={auction._linkToImage}/>
        <div style={{display: 'inline', flexGrow: 1}}>
          <div style={{width: '350px'}}>
            <Box>
              {auction._title}
            </Box>
            <Box sx={{
              typography: 'subtitle2',
              fontWeight: 'light',
              color: 'text.secondary',
            }}>
              {auction._description} {auction._startingBid.toNumber()}
            </Box>
          </div>
        </div>
        {!auction._ended &&
        <> <Button
            onClick={() => endAuction(auction._auctionAddress)}
            size="medium"
            variant="contained"
            disableElevation>
            <Box sx={{fontWeight: 500}}>End Auction</Box>
        </Button>
        <input
          name="bidAmount"
          value={bidAmount}
          onChange={(event) => setBidAmount(event.target.value)}
        >
        </input>
        <Button
            onClick={() => bid(parseInt(bidAmount), auction._auctionAddress)}
            size="medium"
            variant="contained"
            disableElevation>
            <Box sx={{fontWeight: 500}}>Bid</Box>
        </Button>
        </>}
        {auction._ended &&
        <>
         <Button
            onClick={() => getAmount(auction._auctionAddress)}
            size="medium"
            variant="contained"
            disableElevation>
            <Box sx={{fontWeight: 500}}>Get your money</Box>
        </Button>
        </>}
      </Paper>
    </>
  );
};
export default AuctionDetail;
