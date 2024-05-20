import React from 'react'
import AppBar from '@mui/material/AppBar';
import  Toolbar  from '@mui/material/Toolbar';
import { Typography, Button, styled } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import './home.css'
// import { Button } from '@mui/material';
import { Box, bgcolor } from '@mui/system';

const StyledTypography = styled(Typography)({
    color: 'green'
})
const Home = () => {

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "#8bc34a" }}>
            <Toolbar>
                <Typography
                sx={{ mr: 2, flexGrow: 1 }}
                >
                    Pro Coders
                </Typography>
                <Box>
                <Button 
            variant="contained"
            href='/register'
    sx={{
        bgcolor: '#1b5e20',
        "&:hover": {bgcolor: '#7cb342' },
        ml: 2,

    }}
    >
        Register
    </Button>
    <Button 
        variant="contained"
        href="/login"
    sx={{
        bgcolor: '#1b5e20',
        "&:hover": {bgcolor: '#7cb342' },
        ml: 2,

    }}
    >
        Login
    </Button>
                </Box>
            </Toolbar>
        </AppBar>
        
    </Box>
    <Box sx={{ mt: 3, p: 3 }}>
        <Carousel showThumbs={false} autoPlay infiniteLoop>
          <div>
            <img src="/src/assets/slide2.jpg" alt="Slide 1" />
            
          </div>
          <div>
            <img src="/src/assets/slide3.jpg" alt="Slide 2" />
            
          </div>
          <div>
            <img src="/src/assets/slide1.jpg" alt="Slide 3" />
            
          </div>
        </Carousel>
      </Box>
    </>
  )
}

export default Home