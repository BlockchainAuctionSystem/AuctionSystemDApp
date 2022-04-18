import { ACTION_TYPES } from "../actionTypes";

export const AuctionState = {
    auctions: [],
    web3: null,
    account: null,
    contracts: null,
    auctionFactoryInstance: null
};

const auctionReducer = (state = AuctionState, action) => {
    if(action.type == ACTION_TYPES.SETUP_ENV) {
        return {...state, ...action.payload};
    }
    else if(action.type == ACTION_TYPES.READ_AUCTIONS) {
        return {...state, auctions: action.payload};
    }
    else if(action.type == ACTION_TYPES.SET_AUCTION_FACTORY) {
        return {...state, auctionFactoryInstance: action.payload};
    }
    return state;
};

export default auctionReducer;