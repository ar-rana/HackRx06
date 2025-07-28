import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Chat from './pages/Chat';
import Login from './pages/Login';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Chat />} />
          <Route path='/loginandsignup' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
