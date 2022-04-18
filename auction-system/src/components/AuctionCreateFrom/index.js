import React from 'react';
import { useState } from "react";

const AuctionCreateForm= ({handleAuctionCreate}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingBid, setStartingBid] = useState(100);
    const [biddingTime, setBiddingTime] = useState(100);
    const [image, setImage] = useState('');
    return (
    <>
        <form>
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          >
          </input>
          <input
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          >
          </input>
          <input
            name="startingBid"
            value={startingBid}
            onChange={(event) => setStartingBid(event.target.value)}
          >
          </input>
          <input
            name="biddingTime"
            value={biddingTime}
            onChange={(event) => setBiddingTime(event.target.value)}
          >
          </input>
          <input type="file" onChange={(event) => setImage(event.target.files[0])} /> 
        </form>
        <button 
          onClick={(event) => handleAuctionCreate(event, {title, description, startingBid, biddingTime, image})}>
          Create Auction
        </button>
    </>
  );
};

export default AuctionCreateForm;