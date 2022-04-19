import React, { useState } from 'react';
import {Button, Paper, Box, Modal} from '@mui/material';
import { PaperStyle, ModalStyle, COLORS } from '../../utils/constants';
import AuctionDetail from '../AuctionDetail';

const AuctionItem = (props) => {
   const { auction, endAuction, bid, getAmount} = props;
   console.log(auction._linkToImage);
   const [open, setOpen] = useState(false);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);
   return (
    <>
      <Box 
        style={{padding: '16px',
              backgroundColor: 'white',
              borderRadius: '14px'}}>
        <Modal
         open={open}
         onClose={handleClose}>
             <Box sx={ModalStyle} style={{backgroundColor: 'white'}}>
                <AuctionDetail
                    auction={auction}
                    endAuction={endAuction}
                    bid={bid}
                    getAmount={getAmount}
                ></AuctionDetail>
            </Box>
         </Modal>
        <img style={{
           width: '250px', 
           height: '250px',
           borderRadius: '18px',
           objectFit: 'cover'}} 
           src={auction._linkToImage}/>
        <div style={{display: 'flex',
                     flexDirection: 'row', 
                     justifyContent: 'space-between',
                     marginTop: '10px'}}>
            <Box sx={{textAlign: 'left', 
                      color: '#322641', 
                      fontSize: 'body1.fontSize',
                      fontWeight: '500',
                      margin: '5px'}}>
              {auction._title}
            </Box>
        
        <Button
            onClick={handleOpen}
            size="small"
            variant="contained"
            disableElevation
            style={{textTransform: 'none', backgroundColor: COLORS.BLUE}}
            sx={{borderRadius: '16px'}}>
            <Box sx={{fontWeight: 500}}>View info</Box>
        </Button>
        </div>
      </Box>
    </>
  );
};
export default AuctionItem;
