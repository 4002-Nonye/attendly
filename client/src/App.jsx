import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LinkAccountSample from './tests/LinkAccountSample';
import Home from './tests/Home';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/link-account' element={<LinkAccountSample />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
