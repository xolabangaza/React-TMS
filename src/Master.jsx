import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalforAdmins from './ModalforAdmins'; // Assuming this is for viewing tasks
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';


function Master() {
    const navigate = useNavigate();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [users, setUsers] = useState([]); // For user data
    const [showUserList, setShowUserList] = useState(false); // Control user list visibility

    // State to manage user form inputs
    const [userForm, setUserForm] = useState({
        Email: '',
        fName: '',
        sName: '',
    });

    const handleClickHome = () => {
        navigate('/');
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm({
            ...userForm,
            [name]: value,
        });
    };

  
    
    const handleAddUser = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const auth = getAuth(); // Get the Firebase Auth instance
    
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userForm.Email,
                '123456'
            );

            const userId = userCredential.user.uid;
    
            const sqlUserData = {

                FirebaseID: userId,
                fName: userForm.fName,
                sName: userForm.sName,
                Email: userForm.Email,
                role: 'admin',
               
            };
    
            await axios.post('https://localhost:7094/api/UserModels', sqlUserData);
    
            window.alert("User added successfully to Firebase and SQL database.");
            setIsUserModalOpen(false); // Close modal after adding user
 
            setUserForm({
                Email: '',
                fName: '',
                sName: '',
            });
    
        } catch (error) {
            console.error("Error adding user: ", error);
            window.alert("Error adding user: " + error.message); // Display the error to the user
        }
    };
    
    

    // Fetch users for task assignment
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7094/api/UserModels');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Delete user by ID
    const handleDeleteUser = async (Id) => {
        
        const userToDelete = users.find(user => user.id === Id);
        fetchUsers();
        if (!userToDelete) {
            window.alert("User not found.");
            return;
        }
    
        const confirmDelete = window.confirm(`Are you sure you want to delete user with email: ${userToDelete.email}?`);
        if (confirmDelete) {
            try {
                await axios.delete(`https://localhost:7094/api/UserModels/${Id}`);
                window.alert("User deleted successfully!");
                fetchUsers(); 
            } catch (error) {
                console.error('Error deleting user:', error);
                window.alert("Failed to delete user.");
            }
        }
    };
    

    // Fetch users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="img"></div>
    

            <div className='welcomeText' style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'fixed',
                marginLeft: '650px',
                marginTop: '250px'
            }}>
                <h1 className="hover-text" style={{ transition: 'transform 0.3s ease' }}>WELCOME MASTER!</h1>
                <h2 className="hover-text" style={{ transition: 'transform 0.3s ease' }}>HOW CAN WE HELP TODAY?</h2>

                {/* Menu for Admin Management */}
                <div>
                    <button onClick={() => setIsUserModalOpen(!isUserModalOpen)} style={buttonStyle}>
                        Admin Management
                    </button>
                    {isUserModalOpen && (
                        <div className="modal-background" style={modalBackgroundStyle}>
                            <div className="modal-content" style={modalContentStyle}>
                                <h2>Admin Management</h2>
                                <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Form fields for adding admin */}
                                    <div>
                                        <label style={{ color: 'black' }}>Email:</label>
                                        <input type="email" name="Email" value={userForm.Email} onChange={handleChange} required style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ color: 'black' }}>Name:</label>
                                        <input type="text" name="fName" value={userForm.fName} onChange={handleChange} required style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ color: 'black' }}>Surname:</label>
                                        <input type="text" name="sName" value={userForm.sName} onChange={handleChange} required style={inputStyle} />
                                    </div>
                                    <button type="submit" style={buttonStyle}>Add Admin</button>
                                    <button onClick={() => setIsUserModalOpen(false)} style={{ ...buttonStyle, backgroundColor: 'red' }}>Cancel</button>
                                </form>

                                {/* Delete User Button */}
                                <button onClick={() => setShowUserList(!showUserList)} style={buttonStyle}>
                                    Delete a User
                                </button>

                                {/* User list for deletion */}
                                {showUserList && (
                                    <div style={{ marginTop: '20px', textAlign: 'left' }}>
                                        <h3>User List</h3>
                                        {users.map(user => (
                                            <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <span>{user.email}</span>
                                                <button onClick={() => handleDeleteUser(user.id)} style={{ backgroundColor: 'red', color: 'white', padding: '5px', border: 'none', borderRadius: '5px' }}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Menu for Task Management */}
                <div>
                    <button onClick={() => setIsTaskModalOpen(!isTaskModalOpen)} style={buttonStyle}>
                        Task Management
                    </button>
                    {isTaskModalOpen && (
                        <ModalforAdmins
                            users={users} // Pass the user list to the task modal
                            closeModal={() => setIsTaskModalOpen(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Styles
const buttonStyle = {
    backgroundColor: '#515353',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '20px'
};

const inputStyle = {
    borderRadius: '5px',
    padding: '8px',
    width: '250px',
    color: 'black'
};

// Modal styles
const modalBackgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center'
};

export default Master;
