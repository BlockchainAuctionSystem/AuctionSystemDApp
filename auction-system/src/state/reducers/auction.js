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
    else if(action.type == ACTION_TYPES.UPDATE_AUCTION) {
        return {...state, 
        auctions: state.auctions.map(
            (auction) => auction._auctionAddress === action.payload.auctionId ? {...auction, ...action.payload.updatedAuction}
                                    : auction
        )};
    }
    else if(action.type == ACTION_TYPES.ADD_AUCTION) {
        return {...state, auctions: 
            state.auctions.filter(auction => 
                auction._auctionAddress === action.payload._auctionAddress).length !== 0 ? 
                state.auctions : state.auctions.concat(action.payload)};
    };
    return state;
};

export default auctionReducer;