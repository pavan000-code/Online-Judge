import { useState } from 'react';
import React from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QuestionDetails from "./pages/QuestionDetails.jsx";
import AddQuestion from './pages/AddQuestion.jsx';
import EditQuestion from './pages/EditQuestion.jsx';


function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element = {<Home/>}/>
      <Route exact path = "/login" element = {<Login/>} />
      <Route exact path = "/register" element = {<Register/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/question-details/:id" element={<QuestionDetails />} />
      <Route path="/add-question" element={<AddQuestion />} />
        <Route path="/edit-question/:id" element={<EditQuestion />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
