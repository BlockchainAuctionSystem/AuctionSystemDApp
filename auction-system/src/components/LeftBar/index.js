import React from 'react';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { BAR_WIDTH, BootstrapTooltip, COLORS } from '../../utils/constants';

const LeftBar = ({account}) => {
    return (
        <>
        <Container>
        <div style={{marginTop: '5vh', display: 'flex', flexDirection: 'column'}}>
          <Box sx={{color: '#322641', fontSize: 'h6.fontSize', fontWeight: 'bold', lineHeight: 1, mb: 3}}>bidlink.</Box>
        </div>
        <Divider sx={{bgColor: '#979BB0'}} variant="middle" />
        <div style={{flexGrow: 1}}></div>
        <Divider sx={{bgColor: '#979BB0'}} variant="middle" />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}> 
           <BootstrapTooltip title={account ? account.slice(0, 15) + '...' : 'No connected account'}>
            <Avatar 
            sx={{ background: COLORS.GRADIENT,
                mb: 6,
                mt: 3}}
            >
                U
            </Avatar>
            </BootstrapTooltip>
         </div>
      </Container>
        </>
    );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: ${BAR_WIDTH}px;
  overflow: hidden;
  background-color: white;
  border-color: #363336;
  top: 0;
  left: 0;
  height: 100vh;
  margin-bottom: 4vh;
`;
export default LeftBar;