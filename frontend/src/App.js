import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import './App.css';
import Header from './header/Header.js';
import Promtbox from './promptbox/Promtbox.js';
import Workspace from './workspace/Workspace.js';
import Signuppage from './Signup/SignupPage.js';
import LoginPage from './LoginPage/LoginPage.js';

function App() {
  return (
    <div className='container'>
      <Router>
    <Header/>
    <Routes>
      <Route path='/' element={<Promtbox/>}/>
      <Route path='/workspace' element={<Workspace/>}/>
      <Route path='/Sign Up' element={<Signuppage/>}/>
      <Route path='/Login' element={<LoginPage/>}/>
    </Routes>
      </Router>
    </div>
  );
}

export default App;
