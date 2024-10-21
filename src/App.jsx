import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopSec from './HomePage';
import Options from './option';
import Login from './Login';
import Register from './Register';
import Master from './Master';
import OptionsForAdmins from './OptionsForAdmins';
import Sidebar from './sidebar';
 
function App() {
    const location = useLocation();
 
    // Check if the current path is either the homepage or the login page
    const showSidebar = !(location.pathname === '/' || location.pathname === '/Login');
 
    return (
        <>
            {showSidebar && <Sidebar />}
            <Routes>
                <Route path="/" element={<TopSec />} />
                <Route path="/options" element={<Options />} />
                <Route path="/OptionsForAdmins" element={<OptionsForAdmins />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Master" element={<Master />} />
            </Routes>
        </>
    );
}
 
export default function Root() {
    return (
        <Router>
            <App />
        </Router>
    );
}
 