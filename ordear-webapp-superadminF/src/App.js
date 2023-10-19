import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route,Routes,useNavigate} from 'react-router-dom';
import Sidebar from './components/sidebar';
import ConsulterResponsables from './components/ConsulterResponsables';
import ConsulterResdisabled from './components/ConsulterResdisabled';
import Responsable from './components/navbar';
import Restaurant from './/components/Restaurant';
import ForgetPassword from './pages/forgetpassword';
import VerfieyCodeForget from './pages/verfiyCodeForget';
import Profil from './components/Profile';

import Auth from './pages/auth';

function App() {

  return (
     <Router>
    <Routes> 
    <Route path="/" element={<Auth />} />
    <Route path="/responsable" element={<Responsable />} />
    <Route path="/restaurantDetaille" element={<Restaurant />} />
    <Route path="/forgetpassword" element={<ForgetPassword />} />
    <Route path="/verifeycode" element={<VerfieyCodeForget />} />
    <Route path="/consulterResponsablesEnable" element={<ConsulterResponsables/>} />
    <Route path="/consulterResponsablesdidisabled" element={<ConsulterResdisabled/>} />
    <Route path="/profilResponsable" element={<Profil/>} />
    </Routes>
    </Router>
  );
}

export default App;
