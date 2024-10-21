import './sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import nur from './assets/logo.png'
import {
    faFile,
    faPlus,
    faCircleExclamation,
    faCalendarDays,
    faUser,
    faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
 
 
function Sidebar() {
    return (
        <header className="offcanvas-menu">
            <input type="checkbox" id="toggle-menu" />
            <label htmlFor="toggle-menu" className="toggle-open">
                <span></span>
            </label>
            <nav>
                <div>
                    <label style={{ marginLeft: "200px" }} htmlFor="toggle-menu" className="toggle-close">
                        <span></span>
                    </label>
                </div>
                <div  className="logo">
                  <img src={nur} alt="" />
                </div>
                <ul>
                    <li>
                        <a style={{marginTop:'40px'}} href="#">
                            <FontAwesomeIcon icon={faFile} style={{ color: "#f0f2f5" ,marginRight:'20px'}} />
                            TASKS
                        </a>
                    </li>
                    <li>
                        <a href="#about">
                            <FontAwesomeIcon style={{marginRight:'20px'}} icon={faPlus} />
                            CREATE
                        </a>
                    </li>
                    <li>
                        <a style={{marginLeft: '20px'}} href="#resume">
                            <FontAwesomeIcon icon={faCircleExclamation} style={{ color: "#e5e0e0",marginRight: '18px'  }} />
                            IMPORTANT
                        </a>
                    </li>
                    <li>
                        <a style={{marginLeft: '20px'}} href="#skills">
                            <FontAwesomeIcon icon={faCalendarDays} style={{marginRight: '18px'}}/>
                            CALENDAR
                        </a>
                    </li>
                </ul>
                <div style={{ display: "block", marginTop: "490px", textAlign: "center", marginRight: "45px" }}>
                    <p style={{ color: "#e5e0e0", fontSize: "24px" }}>
                        <FontAwesomeIcon style={{marginRight:'20px'}} icon={faUser} />
                        Profile
                    </p>
                    <p
                        style={{
                            color: "#e5e0e0",
                            fontSize: "30px",
                            border: "1px solid rgba(255, 255, 255, 0.664)",
                            width: "160px",
                            textAlign: "center",
                            marginLeft: "20px",
                            marginTop: "10px",
                        }}
                    >
                        <FontAwesomeIcon style={{marginRight:'16px'}} icon={faArrowRightFromBracket} />
                        Log out
                    </p>
                </div>
            </nav>
        </header>
    );
}
 
export default Sidebar;