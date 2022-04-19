import React, { useEffect, useState } from "react";
import {connect} from 'react-redux';
import "./App.css";
import { setupEnv, createAuction } from "./state/actions/auction";
import AuctionList from "./components/AuctionList";
import AuctionCreateForm from "./components/AuctionCreateFrom";
import LeftBar from "./components/LeftBar";
import { BAR_WIDTH, COLORS, BootstrapTooltip, ModalStyle } from "./utils/constants";
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';

const App = ({createAuction, setupEnv,  account, auctionFactoryInstance}) => {
  const [openForm, setOpenForm] = useState(false);
  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);
  const hasEnded = (auction) => { let currentDate= new Date(); return auction && auction._biddingTime < currentDate.getTime()/ 1000; }
  const openFilter = (auction) => auction && !hasEnded(auction);
  const closeFilter = (auction) => auction && hasEnded(auction);
  const [filter, setFilter] = useState(true);
  useEffect(() => {
    try {
      setupEnv();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, []);
  const handleAuctionCreate = (event, props) => {
       event.preventDefault();
       setOpenForm(false);
       createAuction(auctionFactoryInstance, account, props);
  }
  return (
      <div className="App" style={{backgroundColor: '#F3F3F9', overflow: 'auto', minHeight: '100vh'}}>
        <LeftBar account={account}/>
        <div style={{marginLeft: `${BAR_WIDTH + 20}px`, marginRight: '20px'}}>
          <div style={{display: 'flex', flexDirection: 'row', marginTop: '20px', marginBottom: '12px'}}>
            <div>
              <Box sx={{textAlign: 'left', color: '#322641', fontSize: 'h4.fontSize', fontWeight: 'bold', lineHeight: 1.2}}>
                Welcome to bidlink.
              </Box>
              <Box sx={{textAlign: 'left', fontSize: 'body1.fontSize', color: COLORS.GREY}}>
                Discover amazing auctions, all at one click distance. 
              </Box>
            </div>
            <div style={{flexGrow: 1}}></div>
          <div>
          <BootstrapTooltip title="Add auction">
            <IconButton sx={{ bgcolor: 'white' }} onClick={handleOpenForm}>
                <AddIcon sx={{color: COLORS.PINK}}/>
            </IconButton>
          </BootstrapTooltip>
          </div>
        </div>
        <Modal
          open={openForm}
          onClose={handleCloseForm}
        >
          <Box sx={ModalStyle}>
           <AuctionCreateForm handleAuctionCreate={handleAuctionCreate}/>
          </Box>
        </Modal>
        <div style={{float: 'left'}}>
        <Chip sx={{mr: 1}} style={{backgroundColor: !filter? COLORS.PINK : COLORS.BLUE , color: 'white'}} label="Open" onClick={() => setFilter(true)} />
        <Chip sx={{mr: 1}} style={{backgroundColor: filter ? COLORS.PINK : COLORS.BLUE, color: 'white'}} label="Finished" onClick={() => setFilter(false)} />
        </div>
        {filter && <AuctionList filter={openFilter}/>}
        {!filter && <AuctionList filter={closeFilter}/>}
        </div>
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