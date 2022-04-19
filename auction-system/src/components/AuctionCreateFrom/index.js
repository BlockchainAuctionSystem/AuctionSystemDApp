import React from 'react';
import { useState } from "react";
import { StyledInput, COLORS, DEFAULT_AUCTION_PHOTO_URL } from '../../utils/constants';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import {Input,Box, InputLabel, Button} from '@mui/material';

const AuctionCreateForm= ({handleAuctionCreate}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingBid, setStartingBid] = useState('');
    const [biddingTime, setBiddingTime] = useState('');
    const [image, setImage] = useState('');
    console.log("Imagine", image);
    return (
    <div style={{width: '550px', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
        <Box sx={{color: '#322641', fontSize: 'h6.fontSize', fontWeight: 'bold', lineHeight: 1, mb: 3}}>Create a new auction</Box>
        <form>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="title">Title</InputLabel>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </FormControl>

          <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            id="description"
            name="description"
            value={description}
            multiline
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormControl>
        <div style={{marginTop: '12px', display: 'flex'}}>
        <FormControl fullWidth sx={{ m: 1}}>
          <InputLabel htmlFor="startingBid">Starting Bid</InputLabel>
          <Input
            id="startingBid"
            name="startingBid"
            value={startingBid}
            onChange={(event) => setStartingBid(event.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1}}>
          <InputLabel htmlFor="biddingTime">Bidding Time (in seconds)</InputLabel>
          <Input
            id="biddingTime"
            name="biddingTime"
            value={biddingTime}
            onChange={(event) => setBiddingTime(event.target.value)}
          />
        </FormControl>
        </div>
        <Button
            style={{textTransform: 'none'}}
            variant="contained"
            component="label"
            size="small"
            sx={{background: COLORS.PINK, mt: 2, ml: 1, borderRadius: '16px'}}
          >
           <Box sx={{fontWeight: 500}}>Upload File</Box>
              <input type="file" hidden onChange={(event) => setImage(event.target.files[0])} /> 
           </Button>
        </form>
        <img
            style={{width: '250px', 
                 height: '250px', 
                 objectFit: 'cover',
                 borderRadius: '12px', marginTop: '8px'}}
            src={image && image.name ? URL.createObjectURL(image) : DEFAULT_AUCTION_PHOTO_URL}/>
           {image && image.name && <Box sx={{typography: 'subtitle1', mt: 1}}>You uploaded {image.name}</Box>}
        <Button
          style={{textTransform: 'none'}}
          variant="contained"
          size="small"
          sx={{my: 2, width: '150px', background: COLORS.PINK, alignSelf: 'flex-end', borderRadius: '16px'}}
          onClick={(event) => handleAuctionCreate(event, {title, description, startingBid, biddingTime, image})}
        >
           <Box sx={{fontWeight: 500}}>Create auction</Box>
        </Button>
    </div>
  );
};

export default AuctionCreateForm;