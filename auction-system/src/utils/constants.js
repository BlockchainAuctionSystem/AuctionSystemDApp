import styled from 'styled-components';

const DEFAULT_AUCTION_PHOTO_URL =  "https://media.istockphoto.com/photos/gavel-on-auction-word-picture-id917901978?k=20&m=917901978&s=612x612&w=0&h=NULGu8-bVpy28gbW6AZbZlEVra-Q4s2rg607emPfkCs=";

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

export {
    DEFAULT_AUCTION_PHOTO_URL,

    PaperStyle,
    StyledInput
};