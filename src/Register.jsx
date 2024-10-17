import React, { useState } from 'react';
import './login.css';
import grad from './assets/team24a.jpg';
import logo2 from './assets/logo2.png';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Register() {
    const navigate = useNavigate();
    const [RegisterForm, setRegisterFormData] = useState({
        Name: '',
        Surname: '',
        Email: '',
        password: '',
        Role: ''
    });

    const handleClickHome = () => {
        navigate('/'); 
    };
    
    const handleClickHomer = () => {
        navigate('/Login'); 
    };

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setRegisterFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleClickRegister = async (e) => {
        e.preventDefault();

        try {
            // Create user with email and password using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                RegisterForm.Email,
                RegisterForm.password
            );

            const user = userCredential.user;

            // Store additional user information in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                Name: RegisterForm.Name,
                Surname: RegisterForm.Surname,
                Email: RegisterForm.Email,
                Role: RegisterForm.Role
            });

            // Reset the form fields
            setRegisterFormData({
                Name: '',
                Surname: '',
                Email: '',
                password: '',
                Role: ''
            });

            navigate('/Login'); 
        } catch (error) {
            console.error('Registration error:', error);
            window.alert("Registration failed! " + error.message);
        }
    };

    return (
        <div className='container'>
            <div>
                <img className="grad-slide" style={{ marginLeft: '550px' }} src={grad} alt="" />
            </div>
            <form onSubmit={handleClickRegister}>
                <div className='inputs' style={{ textAlign: 'center', color: 'black', fontFamily: 'Sans-serif', marginTop: '330px' }}>
                    <img onClick={handleClickHome} style={{ width: '300px', height: '70px', marginTop: '-150px', marginLeft: '-130px', cursor: 'grab' }} src={logo2} alt="" />
                    First Name: <br />
                    <input name="Name" value={RegisterForm.Name} onChange={handleChanges} required style={{ borderColor: 'black', borderRadius: '5px', height: '30px', marginTop: '10px', width: '250px', marginBottom: '10px' }} placeholder='    First Name' type="text" /><br />
                    Last Name: <br />
                    <input name="Surname" value={RegisterForm.Surname} onChange={handleChanges} required style={{ borderColor: 'black', borderRadius: '5px', height: '30px', marginTop: '10px', width: '250px', marginBottom: '10px' }} placeholder='    Last Name' type="text" /><br />
                    Email: <br />
                    <input name="Email" value={RegisterForm.Email} onChange={handleChanges} required style={{ borderColor: 'black', borderRadius: '5px', height: '30px', marginTop: '10px', width: '250px', marginBottom: '10px' }} placeholder='    Email' type="email" /><br />
                    Password: <br />
                    <input name="password" value={RegisterForm.password} onChange={handleChanges} required style={{ borderColor: 'black', borderRadius: '5px', height: '30px', marginTop: '10px', width: '250px', marginBottom: '10px' }} placeholder='    Password' type="password" />    
                </div>
                <button style={{ borderRadius: '10px', borderColor: 'white', position: 'fixed', marginTop: '630px', marginLeft: '170px', backgroundColor: '#515353', color: 'White', width: '110px', cursor: 'pointer' }} type="submit">REGISTER</button>
            </form>
            <a style={{ borderRadius: '10px', borderColor: 'white', position: 'fixed', marginTop: '695px', cursor: 'pointer', fontFamily: 'Sans-serif', marginLeft: '120px', color: 'darkred', textDecoration: 'underline' }} onClick={handleClickHomer}>Already a user?...Log In Here</a>
        </div>
    );
}

export default Register;
