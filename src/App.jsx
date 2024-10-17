// App.js or the main component file
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopSec from './HomePage';
import Options from './option'; // Ensure you import your Options component
import Login from './Login';
import Register from './Register';
import Master from './Master';
import OptionsForAdmins from './OptionsForAdmins';

function App() {
    return (
        <Router>
            <Routes>
                
                <Route path="/" element={<TopSec />}/>
                <Route path="/options" element={<Options />} />
                <Route path="/OptionsForAdmins" element={<OptionsForAdmins />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Master" element={<Master />}/>
                
            </Routes>
        </Router>
    );
}

export default App;
