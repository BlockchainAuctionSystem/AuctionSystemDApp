import React, { useEffect } from "react";
import {connect} from 'react-redux';
import { useState } from "react";
import "./App.css";
import { readAuctions, setupEnv, createAuction } from "./state/actions/auction";

const App = ({createAuction, setupEnv, readAuctions, account, auctionFactoryInstance, contracts}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState(100);
  const [biddingTime, setBiddingTime] = useState(100);
  const [image, setImage] = useState('');
  useEffect(() => {
    try {
      setupEnv();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, []);
  useEffect(() => {
    if(contracts)
       readAuctions(contracts);
  }, [contracts]);
    // !this.state.web3 && 
    // if (!this.account) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    const handleCreateAuction = (event) => {
       event.preventDefault();
       createAuction(auctionFactoryInstance, account, {title, description, startingBid, biddingTime, image});
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <div>{account}</div>
        <button onClick={(event) => handleCreateAuction(event)}>Create Auction</button>
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
      </div>
    );
};

function mapStateToProps(state) {
  return {
     account: state.account,
     auctionFactoryInstance: state.auctionFactoryInstance,
     contracts: state.contracts
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    setupEnv: () => dispatch(setupEnv()),
    createAuction: (auctionFactoryInstance,account, payload) => dispatch(createAuction(auctionFactoryInstance, account,payload)),
    readAuctions: (contracts) => dispatch(readAuctions(contracts))

  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);