import React from 'react';
import { AppBar, Toolbar, Typography, CssBaseline, Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const Login = () => {
  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <Typography variant="h6">My App</Typography>
        </Toolbar>
      </AppBar>
      
    </div>
  )
}

export default Login