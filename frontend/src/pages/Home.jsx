import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Typography, Button, Link } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './home.css'
import { Box } from '@mui/system';
import CodeEditor from './CodeEditor'

// Import the slide images
import slide1 from '/public/assets/slide1.jpg';
import slide2 from '/public/assets/slide2.jpg';
import slide3 from '/public/assets/slide3.jpg';

const Home = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "#8bc34a" }}>
          <Toolbar>
            <Typography
              variant='h4'
              sx={{ mr: 2, flexGrow: 1 }}
            >
              <Link href="/" sx={{ color: 'white', textDecoration: 'none' }}>ProCoders</Link>
            </Typography>
            <Box>
              <Button
                variant="contained"
                href='/register'
                sx={{
                  bgcolor: '#1b5e20',
                  "&:hover": { bgcolor: '#7cb342' },
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
                  "&:hover": { bgcolor: '#7cb342' },
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
            <img src={slide1} alt="Slide 1" />
          </div>
          <div>
            <img src={slide2} alt="Slide 2" />
          </div>
          <div>
            <img src={slide3} alt="Slide 3" />
          </div>
        </Carousel>
      </Box>
      <Typography variant='h2' sx={{ color: '#8bc34a', fontStyle: 'italic' }}>Experience Hassle free Coding.</Typography>
      <CodeEditor />
    </>
  )
}

export default Home
