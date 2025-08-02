import {BrowserRouter, Routes, Route} from "react-router-dom";
import Chat from './pages/Chat.jsx';
import Login from './pages/Login.jsx';
import ChatWrapper from './pages/ChatWrapper.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/chat' element={<ChatWrapper />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
