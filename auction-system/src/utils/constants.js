import React from 'react';
import styled from 'styled-components';
import { styled as styledMui } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';



const DEFAULT_AUCTION_PHOTO_URL =  "https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png";
const BAR_WIDTH = 200;
const COLORS = {
    WHITE: '',
    PRIMARYBG: '#F3F3F9',
    RED: '#ad2625',
    PINK: '#bd5c89',
    GREYBLUE: '#768cc2',
    GREY: '#979BB0',
    DARKGREY: '#323232',
    BLUE: '#284dd0',
    DARK: '#322641',
    GRADIENT: 'linear-gradient(53deg, rgba(173,38,37,1) 3%, rgba(189,92,137,1) 28%, rgba(118,140,194,1) 47%, rgba(40,77,208,1) 75%, rgba(50,38,65,1) 99%, rgba(50,38,65,1) 100%)'
}

const BootstrapTooltip = styledMui(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

const PaperStyle = {
    padding: '10px',
    height: 'auto',
    display: 'inline-flex',
    flexDirection: 'row',
    borderRadius: '10px',
    gap: '20px',
  };
  
const StyledInput = styled.input`
    width: 350px;
    margin-left:auto !important;
    margin-right:auto !important;
    height: 40px;
    border: none;
    margin: 0.5rem 0;
    color: #393c41 !important;
    background-color: #f5f5f5;
    box-shadow:  0px 14px 9px -15px rgba(0,0,0,0.25);
    border-radius: 32px;
    padding:  0 1rem;
    &:hover{
    outline-width: 0;
    }
    &:focus{
    outline-width: 0;
    // border: 3px solid rgb(62,106,225,0.7);
    }
`;

const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    boxShadow: 24,
    backgroundColor: '#f5f5f5',
    padding: '25px'
    // boxShadow: '0px 0px 27px 6px rgba(255,255,255,0.32)',
  };
export {
    BAR_WIDTH,
    COLORS,
    DEFAULT_AUCTION_PHOTO_URL,

    PaperStyle,
    ModalStyle,
    StyledInput,
    BootstrapTooltip
};