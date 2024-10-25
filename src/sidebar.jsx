import React, { useState } from 'react';
import './sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import nur from './assets/logo.png';
import {
    faFile,
    faPlus,
    faCircleExclamation,
    faCalendarDays,
    faUser,
    faArrowRightFromBracket ,
    faGear
} from "@fortawesome/free-solid-svg-icons";
import TaskListModal from './TaskListModal'; // Import the modal component
 
function Sidebar() {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isFullSidebarOpen, setIsFullSidebarOpen] = useState(false); // State for full sidebar visibility
 
    // Function to open TaskListModal
    const openTaskModal = () => {
        setIsTaskModalOpen(true);
    };
 
    // Function to close TaskListModal
    const closeTaskModal = () => {
        setIsTaskModalOpen(false);
    };
 
    // Function to toggle the full sidebar
    const toggleFullSidebar = () => {
        setIsFullSidebarOpen(prevState => !prevState);
    };
 
    return (
        <header className="offcanvas-menu">
            <input type="checkbox" id="toggle-menu" checked={isFullSidebarOpen} onChange={toggleFullSidebar} />
 
            {/* Toggle Button for Full Sidebar */}
            {/* <label htmlFor="toggle-menu" className="toggle-open" onClick={toggleFullSidebar}>
                <span></span>
            </label> */}
 
            {/* Small Sidebar (Only Icons) */}
            <nav className="small-sidebar">
            <div className="logos">
                        <img src={nur} alt="" />
                    </div>
                <ul>
                    <li>
                        <a onClick={() => { toggleFullSidebar(); openTaskModal(); }}>
                            <FontAwesomeIcon icon={faFile} />
                        </a>
                    </li>
                    <li>
                        <a onClick={toggleFullSidebar}>
                            <FontAwesomeIcon icon={faPlus} />
                        </a>
                    </li>
                    <li>
                        <a  onClick={toggleFullSidebar}>
                            <FontAwesomeIcon icon={faCircleExclamation}  />
                        </a>
                    </li>
                    <li>
                        <a onClick={toggleFullSidebar}>
                            <FontAwesomeIcon icon={faCalendarDays} />
                        </a>
                    </li>
                    <li>
                    <a href="#skills" onClick={toggleFullSidebar}>
                    <FontAwesomeIcon icon={faGear}  />
                        </a>
                    </li>
                </ul>
             
                    <div className="profile-section" style={{ fontSize: "30px", marginTop:'60px'}}>
                        <p style={{ color: "#e5e0e0", fontSize: "30px" }}>
                            <FontAwesomeIcon icon={faUser} style={{ marginRight: '20px' }} />
                         
                        </p>
                        <p style={{ fontSize: "30px" }}className="logout-button">
                            <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ marginRight:'16px' }} />
                         
                        </p>
                    </div>
            </nav>
 
            {/* Full Sidebar (Icons and Text) */}
            {isFullSidebarOpen && (
                <nav className="full-sidebar">
                    <div>
                        {/* <label htmlFor="toggle-menu" className="toggle-close" onClick={toggleFullSidebar}>
                            <span></span>
                        </label> */}
                    </div>
                    <div className="logo">
                        <img src={nur} alt="" />
                    </div>
                    <ul>
                        <li style={{marginRight:'55px'}}>
                            <a style={{marginTop: '45px'}} onClick={() => { toggleFullSidebar(); openTaskModal(); }}>
                                <FontAwesomeIcon icon={faFile} style={{marginRight: '20px' }} />
                                TASKS
                            </a>
                        </li>
                        <li style={{marginRight:'40px'}}>
                            <a href="#about" onClick={toggleFullSidebar}>
                                <FontAwesomeIcon style={{ marginRight: '20px' }} icon={faPlus} />
                                CREATE
                                <select style={{padding:'3px 3px'}} name='cr'>
                                    <option value="">Add Task to myself</option>
                                    <option value="">Assign task to someone else</option>
                                </select>
                            </a>
                        </li>
                        <li>
                            <a href="#resume" onClick={toggleFullSidebar}>
                                <FontAwesomeIcon style={{ marginRight: '20px' }} icon={faCircleExclamation} />
                                IMPORTANT
                            </a>
                        </li>
                        <li>
                            <a href="#skills" onClick={toggleFullSidebar}>
                                <FontAwesomeIcon style={{ marginRight: '20px' }} icon={faCalendarDays} />
                                CALENDAR
                            </a>
                        </li>
                        <li>
                    <a href="#skills" style={{fontSize:'30px', marginRight:'24px'}} onClick={toggleFullSidebar}>
                    <FontAwesomeIcon style={{marginRight:'15px'}} icon={faGear}  />
                    Settings
                        </a>
                    </li>
                    </ul>
                    {/* <div className='settings' style={{marginTop:'50px'}}>
                        <p style={{fontSize:'30px', color:'#e5e0e0', marginLeft:'12px'}}>
                        <FontAwesomeIcon icon={faGear} style={{color: "#f7f7f8", marginRight:'10px'}} />
                        Settings
                        </p>
                    </div> */}
                    <div className="profile-section" style={{marginTop:'90px', marginRight:'44px', fontSize: "23px" }}>
                        <p style={{ color: "#e5e0e0"}}>
                            <FontAwesomeIcon icon={faUser} style={{ marginRight: '20px' }} />
                            Profile
                        </p>
                        <p className="logout-button" style={{marginLeft:'4px'}}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ marginRight: '16px' ,fontSize: "21px"}} />
                            Log out
                        </p>
                    </div>
                </nav>
            )}
 
            {/* TaskListModal Component */}
            <TaskListModal
                isOpen={isTaskModalOpen}
                closeModal={closeTaskModal}
                editTask={(task) => console.log('Edit Task:', task)}
            />
        </header>
    );
}
 
export default Sidebar;