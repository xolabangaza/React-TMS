import React, { useState, useEffect } from 'react';
import './Modal.css';
import axios from 'axios';
import TaskListModal from './TaskListModal';
import { getAuth } from 'firebase/auth';

function ModalforAdmins() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
        duedate: '',
        author: '', // Author field to be set with logged-in email
        assignedTo: '',
    });
    const [isTaskListOpen, setIsTaskListOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [users, setUsers] = useState([]);
    const [isAssigningToOthers, setIsAssigningToOthers] = useState(false); // State to control showing "Assign to Email"

    const today = new Date().toISOString().slice(0, 16); // Current date in YYYY-MM-DD format

    useEffect(() => {
        // Fetch users when modal opens for assigning tasks
        if (isAssigningToOthers) {
            const fetchUsers = async () => {
                try {
                    const response = await axios.get('https://localhost:7094/api/UserModels');
                    setUsers(response.data); // Store the user data
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };

            fetchUsers();
        }
    }, [isAssigningToOthers]); // Fetch users only when assigning tasks to others

    // Function to retrieve the logged-in email using Firebase Auth
    const getLoggedInEmail = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        return user ? user.email : ''; // Return the user's email if logged in
    };

    const openModal = (isAssigning = false) => {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        document.body.style.overflow = 'hidden';
        setIsModalOpen(true);
        setIsFadingOut(false);
        setIsEditing(false);
        setIsAssigningToOthers(isAssigning); // Set assigning state
        
        const loggedInEmail = getLoggedInEmail();
        
        setFormData({
            title: '',
            description: '',
            status: '',
            duedate: '',
            author: loggedInEmail || '', // Set the logged-in email as the author
            assignedTo: '', // Reset assignedTo when modal is opened
        });
    };

    const closeModal = () => {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0px';
        setIsFadingOut(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsSuccess(false);
        }, 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting task:", formData);

        try {
            if (!isEditing) {
                const response = await axios.get('https://localhost:7094/api/TaskModels');
                const tasks = response.data;

                const isDuplicate = tasks.some(task => 
                    task.title.toLowerCase() === formData.title.toLowerCase() &&
                    task.description.toLowerCase() === formData.description.toLowerCase()
                );

                if (isDuplicate) {
                    alert("A task with the same title and description already exists. Please enter a different task.");
                    return;
                }
            }

            // Ensure assignedTo is the same as author when creating task for self
            const postData = {
                ...formData,
                ...(isAssigningToOthers && formData.assignedTo && { assignedTo: formData.assignedTo }) // Include assignedTo only when assigning to others
            };

            // Set assignedTo to author if creating for self
            if (!isAssigningToOthers) {
                postData.assignedTo = postData.author; // Ensure assignedTo matches author
            }

            console.log("Sending data to API:", postData);
            await axios.post('https://localhost:7094/api/TaskModels', postData);
            
            setIsSuccess(true);
            setTimeout(() => {
                closeModal();
            }, 1000);
        } catch (error) {
            console.error('Error processing task:', error);
            alert('An error occurred while processing the task.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const openTaskList = () => {
        setIsTaskListOpen(true);
    };

    const closeTaskList = () => {
        setIsTaskListOpen(false);
    };

    const editTask = (task) => {
        setFormData({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            duedate: new Date(task.duedate).toISOString().slice(0, 16), // Format for datetime-local input
            assignedTo: task.assignedTo || '',
        });

        setIsEditing(true);
        closeTaskList();
        openModal(false);
    };

    return (
        <div className="Modal" style={{ position: 'center' }}>
            <div className='Modalbuttons' style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    style={{ padding: '15px', borderRadius: '25px', boxShadow: '4px 5px 1px', marginRight: '100px' }}
                    onClick={() => openModal(false)} // Open modal for admin task
                >
                    Add Task for Myself
                </button>
                <button
                    style={{ padding: '15px', borderRadius: '25px', boxShadow: '-4px 5px 1px', marginRight: '100px' }}
                    onClick={() => openModal(true)} // Open modal for assigning task
                >
                    Assign Task to Someone Else
                </button>
                <button
                    style={{ padding: '15px', borderRadius: '25px', boxShadow: '4px 5px 1px', marginRight: '100px' }}
                    onClick={openTaskList}
                >
                    View All Tasks
                </button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay-input">
                    <div className={`modal-content ${isFadingOut ? 'fade-out' : ''}`}>
                        {isSuccess ? (
                            <div className="success-message">
                                <h3>Success!</h3>
                                <p>Your task has been successfully {isEditing ? 'updated' : 'created'}.</p>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ marginLeft: '10px' }}>{isEditing ? 'Edit Task' : (isAssigningToOthers ? 'Assign Task' : 'Create Task')}</h3>
                                <br />
                                <form onSubmit={handleSubmit}>
                                    <label style={{ marginLeft: '100px' }}>
                                        Title:&nbsp;&nbsp;&nbsp;
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                backgroundColor: 'lightgray',
                                                color: 'blue',
                                                borderColor: 'black',
                                                padding: '12px',
                                                margin: '10px',
                                                borderRadius: '10px',
                                                marginLeft: '100px'
                                            }}
                                        />
                                    </label>
                                    <br />
                                    <label style={{ marginLeft: '100px' }}>
                                        Description:
                                        <input
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                backgroundColor: 'lightgray',
                                                color: 'blue',
                                                borderColor: 'black',
                                                padding: '12px',
                                                margin: '10px',
                                                borderRadius: '10px',
                                                marginLeft: '67px'
                                            }}
                                        />
                                    </label>
                                    <br />
                                    <label style={{ marginLeft: '100px' }}>
                                        Status:&nbsp;&nbsp;&nbsp;
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                backgroundColor: 'lightgray',
                                                color: 'blue',
                                                borderColor: 'black',
                                                padding: '12px',
                                                width: '196px',
                                                textAlign: 'center',
                                                margin: '10px',
                                                borderRadius: '10px',
                                                marginLeft: '90px',
                                            }}
                                        >
                                            <option value="" disabled hidden>Select an Option</option>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </label>
                                    <br />
                                    <label style={{ marginLeft: '100px' }}>
                                        Due Date:&nbsp;&nbsp;&nbsp;
                                        <input
                                            type="datetime-local"
                                            name="duedate"
                                            value={formData.duedate || today}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                backgroundColor: 'lightgray',
                                                color: 'blue',
                                                borderColor: 'black',
                                                padding: '12px',
                                                margin: '10px',
                                                borderRadius: '10px',
                                                marginLeft: '90px'
                                            }}
                                        />
                                    </label>
                                    <br />
                                    <label style={{ marginLeft: '100px' }}>
                                        Author:&nbsp;&nbsp;&nbsp;
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            disabled // Disable this field
                                            style={{
                                                backgroundColor: 'lightgray',
                                                color: 'blue',
                                                borderColor: 'black',
                                                padding: '12px',
                                                margin: '10px',
                                                borderRadius: '10px',
                                                marginLeft: '105px'
                                            }}
                                        />
                                    </label>
                                    <br />
                                    {isAssigningToOthers && (
                                        <label style={{ marginLeft: '100px' }}>
                                            Assign to Email:&nbsp;&nbsp;&nbsp;
                                            <select
                                                name="assignedTo"
                                                value={formData.assignedTo}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    backgroundColor: 'lightgray',
                                                    color: 'blue',
                                                    borderColor: 'black',
                                                    padding: '12px',
                                                    margin: '10px',
                                                    borderRadius: '10px',
                                                    marginLeft: '32px'
                                                }}
                                            >
                                                <option value="" disabled hidden>Select a user</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.email}>{user.email}</option>
                                                ))}
                                            </select>
                                        </label>
                                    )}
                                    <br />
                                    <div className="modal-buttons">
                                        <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: 'green', color: 'white' }}>
                                            {isEditing ? 'Update Task' : 'Create Task'}
                                        </button>
                                        <button type="button" onClick={closeModal} style={{ padding: '10px', borderRadius: '5px', backgroundColor: 'red', color: 'white' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
            {isTaskListOpen && (
                <TaskListModal isOpen={openTaskList} closeModal={closeTaskList} editTask={editTask} />
            )}
        </div>
    );
}

export default ModalforAdmins;
