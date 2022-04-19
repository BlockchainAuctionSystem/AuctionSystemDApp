import React, { useState } from 'react';
import {Button, Avatar, TextField, Box, Divider, FormControl, InputLabel, Input} from '@mui/material';
import { formatDate } from '../../utils/functions';
import { PaperStyle, BootstrapTooltip, COLORS } from '../../utils/constants';

const AuctionDetail = (props) => {
   const { auction, endAuction, bid, getAmount} = props;
   const {month, day, dayHour} = formatDate(auction._biddingTime.toNumber());
   const [bidAmount, setBidAmount] = useState(100);
   console.log(auction._linkToImage);
   return (
    <>
      <Box style={{width: '900px'}} sx={{display: 'flex', flexDirection: 'row', gap: 3}}>
        <img
         style={{width: '500px', 
                 height: '500px', 
                 objectFit: 'cover',
                 borderRadius: '12px'}}
         src={auction._linkToImage}/>
        <div style={{display: 'flex', flexDirection: 'column'}}>
           <Box sx={{color: '#322641', fontSize: 'h5.fontSize', fontWeight: 'bold'}}>
              {auction._title}
           </Box>
           <Box sx={{
              typography: 'subtitle2',
              fontWeight: 'light',
              color: 'text.secondary',
            }}>
              Minimum bid <span style={{fontWeight: '500'}}>{auction._startingBid.toNumber()} ETH</span>
            </Box>

            <Box sx={{fontWeight: '500', mt: 4}}>Details</Box>
            <Box sx={{fontSize: 'body1.fontSize'}}>{auction._description}</Box>
            <div style={{display: 'flex'}}>
                <div>
                <Box sx={{fontWeight: '500', mt: 2}}>Highest bidder</Box>
                <BootstrapTooltip title={auction._highestBid.toNumber() != 0 ? auction._highestBidder : 'No one bidded yet'}>
                <Avatar 
                sx={{ my: 1, background: COLORS.GRADIENT}}
                >
                    U
                </Avatar>
                </BootstrapTooltip>
              </div>
              <div style={{marginLeft: '10px'}}>
              <Box sx={{fontWeight: '500', mt: 2}}>Highest bid</Box>
              <Box sx={{fontWeight: '500', my: 1}}>{auction._highestBid.toNumber()} ETH</Box>
              </div>
            </div>
            <Box sx={{fontWeight: '500', mt: 1}}>Available until</Box>
            <div>
            <Box sx={{fontSize: 'body1.fontSize'}}>{month} {day}</Box>
            <Box sx={{
                typography: 'subtitle2',
                fontWeight: 'light',
                color: 'text.secondary',
            }}>
                {dayHour}
            </Box>
            </div>
           <div style={{flexGrow: 1}}></div>
           <Divider sx={{bgColor: '#979BB0', my: 2}}  />
           <div>
           {!auction._ended &&
            <> 
               <TextField
                    id="bidAmount"
                    name="bidAmount"
                    value={bidAmount}
                    placeholder="Bid amount"
                    sx={{ display: 'inline'}}
                    onChange={(event) => setBidAmount(event.target.value)}>
               </TextField>
              <Button
                onClick={() => bid(parseInt(bidAmount), auction._auctionAddress)}
                size="small"
                variant="contained"
                style={{textTransform: 'none'}}
                sx={{borderRadius: '16px', display: 'inline', ml: 2}}
                >
                <Box sx={{fontWeight: 500}}>Bid</Box>
            </Button>
            </>}
            </div>
         {!auction._ended &&
        <Button
            onClick={() => endAuction(auction._auctionAddress)}
            size="medium"
            variant="contained"
            style={{textTransform: 'none'}}
            sx={{borderRadius: '16px', m: 1}}>
            <Box sx={{fontWeight: 500}}>End Auction</Box>
        </Button>}
        {auction._ended &&
        <>
         <Button
            onClick={() => getAmount(auction._auctionAddress)}
            size="medium"
            variant="contained"
            style={{textTransform: 'none'}}
            sx={{borderRadius: '16px', m: 1}}>
            <Box sx={{fontWeight: 500}}>Get your money</Box>
        </Button>
        </>}
        </div>
      </Box>
    </>
  );
};
export default AuctionDetail;
