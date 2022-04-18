import React, { useEffect } from "react";
import {connect} from 'react-redux';
import "./App.css";
import { setupEnv, createAuction } from "./state/actions/auction";
import AuctionList from "./components/AuctionList";
import AuctionCreateForm from "./components/AuctionCreateFrom";

const App = ({createAuction, setupEnv,  account, auctionFactoryInstance}) => {
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
 
    // !this.state.web3 && 
    // if (!this.account) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    const handleAuctionCreate = (event, props) => {
       event.preventDefault();
       createAuction(auctionFactoryInstance, account, props);
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <div>{account}</div>
        <AuctionList filter={(auction) => !auction._ended}/>
        <AuctionList filter={(auction) => auction._ended}/>
        <AuctionCreateForm handleAuctionCreate={handleAuctionCreate}/>
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
    createAuction: (auctionFactoryInstance, account, payload) => dispatch(createAuction(auctionFactoryInstance, account,payload))
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);