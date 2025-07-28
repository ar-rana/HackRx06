import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Chat from './pages/Chat';
import Login from './pages/Login';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/chat' element={<Chat />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
