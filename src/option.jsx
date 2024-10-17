import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';
import red from './assets/logo.png';

function Options() {

    const navigates = useNavigate();

    const handleClickHome = () => {
        navigates('/'); 
    };

    return (
        <div>
            <div className="img"></div>
            <div className="logo"> 
            <img 
                src={red} 
                onClick={handleClickHome} 
                alt="" 
                style={{
                    position: 'fixed',
                    height: '100px', 
                    width: '100px', 
                    marginTop: '40px', 
                    cursor: 'grab', 
                    marginLeft: '40px'
                }}
            />
            </div>
            <div 
                className='welcomeText' 
                style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    position: 'fixed', 
                    marginLeft: '650px', 
                    marginTop: '250px'
                }}
            >
                <h1 className="hover-text" style={{ transition: 'transform 0.3s ease' }}>WELCOME USER!</h1>
                <h2 className="hover-text" style={{ transition: 'transform 0.3s ease' }}>HOW CAN WE HELP TODAY?</h2>
                <Modal />
            </div>
        </div>
    );
}

export default Options;
