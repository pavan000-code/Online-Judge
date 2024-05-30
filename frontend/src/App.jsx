import { useState } from 'react';
import React from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QuestionDetails from "./pages/QuestionDetails.jsx";



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element = {<Home/>}/>
      <Route exact path = "/login" element = {<Login/>} />
      <Route exact path = "/register" element = {<Register/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/question/:id" element={<QuestionDetails />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
