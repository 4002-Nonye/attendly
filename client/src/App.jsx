import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LinkAccountSample from './tests/LinkAccountSample';
import Home from './tests/Home';
import ScanQrCode from './tests/ScanQrCode';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/link-account' element={<LinkAccountSample />} />
      <Route path='/scan-code' element={<ScanQrCode/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
