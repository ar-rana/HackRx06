import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login.jsx';
import ChatWrapper from './pages/ChatWrapper.jsx';
import Error from "./pages/Error.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/chat' element={<ChatWrapper />} />
          <Route path='/' element={<Login />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
