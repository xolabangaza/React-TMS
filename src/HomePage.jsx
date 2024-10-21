import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import red from './assets/logo.png';
import vid from './assets/VideoProject.mp4';

function TopSec() {

    const navigate = useNavigate();
    

    const handleClick = () => {
        navigate('/Login'); // Navigate to the Options page
    };

    const handleClickRefresh = () => {
        window.location.reload()
    };

    return (    
        <div>
            <div className='logo'>
            <img 
                src={red} 
                onClick={handleClickRefresh} 
                alt="" 
                style={{
                    position: 'relative',
                    height: '100px', 
                    width: '100px', 
                    cursor: 'grab', 
                    marginTop:'50px',
                    marginLeft: '40px'
                }}
            />
            </div> 
           <video
                    autoPlay
                    muted
                    loop
                    style={{
                        position: 'fixed',
                        right: '0',
                        bottom: '0',
                        minWidth: '100%',
                        minHeight: '100%',
                        zIndex: '-1',
                        objectFit: 'cover',
                        filter: 'brightness(0.3)' 
                    }}
                >
                    <source src={vid} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            <div >
                <h1 style={{textAlign:'center',color:'white',marginTop: '120px', fontSize: '60px'}} className="heading">Welcome to Team 25A's Task Management System</h1>
                <p style={{textAlign:'center',color:'rgb(173, 176, 182)', marginBottom:'80px', marginTop: '70px', fontSize: '23px'}}>This tool was created using Figma, html, ReactJS, JavaScript and C#, SQL for the back-end. This program represents a simple task management system that allows  <br />a user to create, view, delete and update a task. This is possible by using API's that were created on the C# side. <br />The API connects to a database that stores these values. </p>
                <h3>TO GET STARTED PRESS HERE!</h3>
                <button 
                    style={{ borderRadius: '25px', boxShadow: '4px 5px',marginLeft:'900px',padding:'15px',paddingLeft:'30px',paddingRight:'30px' ,marginTop:'40px'}} 
                    onClick={handleClick} // Call handleClick on button click
                >
                Click Me
                </button>
            </div>  
        </div>




    );
}

export default TopSec;
