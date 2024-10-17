import React, { useState } from 'react';
import './login.css';
import grad from './assets/team24a.jpg';
import logo2 from './assets/logo2.png';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore
import axios from 'axios';


const db = getFirestore(); // Initialize Firestore

function Login() {
    const navigate = useNavigate();

    // Use email and password as state properties
    const [loginForm, setLoginFormData] = useState({
        Email: '',
        Password: '',
    });

    const handleClickHome = () => {
        navigate('/');
    };

  

    const handleClickLogin = async (e) => {
        e.preventDefault();
    
        const email = loginForm.Email.trim(); // Trim whitespace
        const password = loginForm.Password;
    
        console.log("Login form data: ", { email, password }); // Log trimmed form data
    
        try { 
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            console.log("User logged in: ", user.uid);
    
    
            const response = await axios.get(`https://localhost:7094/api/Users/${user.uid}`);
    
     
            if (response.data) {
                console.log("Fetched user role: ", response.data);
                const role = response.data.role;
    
                if ( role == "admin") {
                    navigate('/OptionsForAdmins');
                }else if(role == "master"){
                    navigate('/Master')
                }else {
                    window.alert('Invalid user role.');
                }
            } else {
                window.alert('User role not found in the response.');
            }
        } catch (err) {
            console.error("Login error: ", err);
    
            if (err.response) {
                console.error("Backend error response: ", err.response);
                if (err.response.status === 404) {
                    window.alert('User role not found.');
                } else {
                    window.alert('Error fetching user role. Please try again later.');
                }
            } else if (err.code === 'auth/wrong-password') {
                window.alert('Invalid password. Please try again.');
            } else if (err.code === 'auth/user-not-found') {
                window.alert('User not found. Please check your email.');
            } else {
                window.alert('Invalid Credentials, please try again');
            }
        }
    };

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setLoginFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='container'>
            <div>
                <img className="grad-slid" src={grad} alt="Background" />
            </div>
            <form onSubmit={handleClickLogin}>
                <div className='input' style={{ textAlign: 'center', color: 'black', fontFamily: 'Sans-serif', marginTop: '430px' }}>
                    <img
                        onClick={handleClickHome}
                        style={{ width: '300px', height: '70px', marginTop: '-150px', marginLeft: '-130px', cursor: 'grab' }}
                        src={logo2}
                        alt="Logo"
                    />
                    <label className='label'>Email: </label><br />
                    <input
                        name='Email'
                        value={loginForm.Email}
                        required
                        onChange={handleChanges}
                        style={{ borderColor: 'black', borderRadius: '5px', height: '30px', marginTop: '10px', marginBottom: '10px', width: '250px' }}
                        placeholder='Email'
                        type="text" 
                    /><br />
                    <label className='label'>Password: </label> <br />
                    <input
                        name='Password'
                        value={loginForm.Password}
                        required
                        onChange={handleChanges}
                        style={{ borderColor: 'black', borderRadius: '5px', height: '30px', marginTop: '10px', width: '250px' }}
                        placeholder='Password'
                        type="password"
                    /><br />
                </div>
                <button
                    style={{ borderRadius: '10px', borderColor: 'white', position: 'fixed', marginTop: '650px', marginLeft: '1620px', backgroundColor: '#515353', color: 'White', width: '110px', cursor: 'pointer' }}
                    className="cancel"
                    type="submit"
                >
                    LOG-IN
                </button>
            </form>
        </div>
    );
}

export default Login;
