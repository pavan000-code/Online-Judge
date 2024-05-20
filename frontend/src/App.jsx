import { useState } from 'react';
import React from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashbord from './pages/Dashbord.jsx';



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element = {<Home/>}/>
      <Route exact path = "/login" element = {<Login/>} />
      <Route exact path = "/register" element = {<Register/>} />
      <Route exact path = "/dashboard" element = {<Dashbord/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
