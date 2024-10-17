import React, { useState } from 'react';
import './Modal.css';
import axios from 'axios';
import TaskListModal from './TaskListModal';



function Modal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
        dueDate: '',
        Author:  localStorage.getItem('email'),
        AssignedTo: localStorage.getItem('email')
    });
    const [isTaskListOpen, setIsTaskListOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const today = new Date().toISOString().slice(0, 16); 

    const openModal = () => {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollBarWidth}px`; 
        document.body.style.overflow = 'hidden';
        setIsModalOpen(true);
        setIsFadingOut(false);
    };
    
    const closeModal = () => {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0px'; 
        setIsFadingOut(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsEditing(false);
            setFormData({
                title: '',
                description: '',
                status: '',
                dueDate: '',
            });
            setIsSuccess(false);
        }, 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
    
            if (isEditing) {

                await axios.put(`https://localhost:7094/api/TaskModels/${formData.id}`, formData);
                setIsSuccess(true);
                setTimeout(() => {
                    closeModal();
                }, 1000);
            } else {
                
                await axios.post('https://localhost:7094/api/TaskModels', formData);
                setIsSuccess(true);
                setTimeout(() => {
                    closeModal();
                }, 1000);
            }
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
        // Pre-populate the form with the selected task's details
        setFormData({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: new Date(task.dueDate).toISOString().slice(0, 16), // Format for datetime-local input
            
        });

        setIsEditing(true);
        closeTaskList(); // Close the task list modal
        openModal();     // Open the editing modal
    };

    return (
        <div className="Modal" style={{position: 'center'}}>
            <div className='Modalbuttons' style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                <button style={{ padding: '15px', borderRadius: '25px', boxShadow: '4px 5px 1px', marginRight: '100px' }} onClick={openModal}>Add New Task</button>&nbsp;&nbsp;&nbsp;&nbsp;
                <button style={{ padding: '15px', borderRadius: '25px', boxShadow: '-4px 5px 1px', marginRight: '100px' }} onClick={openTaskList}>View All Tasks</button>
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
                                <h3 style={{marginLeft: '10px'}}>{isEditing ? 'Edit Task' : 'Enter Your Details'}</h3>
                                <br />
                                <form onSubmit={handleSubmit}>
                                    <label style={{marginLeft: '100px'}}>
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
                                    <label style={{marginLeft: '100px'}}>
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
                                    <label style={{marginLeft: '100px'}}>
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
                                    <br />
                                    <label style={{marginLeft: '100px'}}>
                                        Due Date:
                                        <input
                                            type="datetime-local"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={handleChange}
                                            required
                                            min={today}  // Minimum due date is set to today
                                            style={{
                                                backgroundColor: 'lightgray',
                                                color: 'blue',
                                                borderColor: 'black',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                marginLeft: '80px',
                                                width: '196px',

                                            }}
                                        />
                                    </label>
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginLeft: '60px' }}>
                                        <button style={{ marginLeft: '10px', borderRadius: '10px' }} type="submit" >{isEditing ? 'Update' : 'Submit'}</button>
                                        <div>
                                            <button style={{ marginLeft: '20px', borderRadius: '10px'}} className="cancel" type="button" onClick={closeModal}>Cancel</button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Task List Modal for viewing all tasks */}
            <TaskListModal isOpen={isTaskListOpen} closeModal={closeTaskList} editTask={editTask} />
          
            
        </div>
    );
}

export default Modal;
