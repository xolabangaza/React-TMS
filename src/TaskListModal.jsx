import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'; 
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import './Modal.css';

function TaskListModal({ isOpen, closeModal, editTask }) {
    const [tasks, setTasks] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [filter, setFilter] = useState('all');
    const [assignedFilter, setAssignedFilter] = useState('all'); // New state for filtering tasks assigned by/to the user

    useEffect(() => {
        if (isOpen) {
            fetchTasks();
        }
    }, [isOpen]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('https://localhost:7094/api/TaskModels');
            const auth = getAuth();
            const currentUserEmail = auth.currentUser?.email; // Get the current user's email from Firebase
    
            // Include tasks where the current user is the author or the assignee
            const userTasks = response.data.filter(
                task => task.assignedTo === currentUserEmail || task.author === currentUserEmail
            );
    
            setTasks(userTasks); // Set state with filtered tasks
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm("Is jy verseker boetie?")) {
            try {
                await axios.delete(`https://localhost:7094/api/TaskModels/${id}`);
                setTasks(tasks.filter(task => task.id !== id)); 
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                }, 1000);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        } else {
            console.log("User clicked No");
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        let taskPerPage = 5;
        let currentPageTasks = 0;
        const taskHeight = 55;

        doc.setFontSize(18);
        doc.text('Task List', 20, 20);

        tasks.forEach((task, index) => {
            let yOffset = 40 + (currentPageTasks * (taskHeight + 10));
            doc.rect(15, yOffset - 10, 180, taskHeight); 
            doc.setFontSize(12);
            doc.text(`ID: ${task.id}`, 20, yOffset);
            doc.text(`Title: ${task.title}`, 20, yOffset + 10);
            doc.text(`Description: ${task.description}`, 20, yOffset + 20);
            doc.text(`Status: ${task.status}`, 20, yOffset + 30);
            doc.text(`Due Date: ${new Date(task.dueDate).toLocaleString()}`, 20, yOffset + 40);
            currentPageTasks++;
            if (currentPageTasks === taskPerPage && index !== tasks.length - 1) {
                doc.addPage(); 
                doc.setFontSize(18);
                doc.text('Task List', 20, 20); 
                currentPageTasks = 0; 
            }
        });

        doc.save('tasks.pdf'); 
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(tasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
        XLSX.writeFile(workbook, "tasks.xlsx");
    };

    const auth = getAuth();
    const currentUserEmail = auth.currentUser?.email;

    // Filter tasks based on selected status and assignment filter
    const filteredTasks = filter === 'all' 
        ? tasks
        : tasks.filter(task => task.status === filter);

    const tasksToDisplay = assignedFilter === 'all'
        ? filteredTasks
        : assignedFilter === 'assignedByMe'
        ? filteredTasks.filter(task => task.author === currentUserEmail && task.author != task.assignedTo)
        : assignedFilter === 'assignedToMe'
        ? filteredTasks.filter(task => task.assignedTo === currentUserEmail && task.author != currentUserEmail)
        : filteredTasks.filter(task => task.author === currentUserEmail && task.assignedTo === currentUserEmail); 

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="task-list-modal">
                    <div style={{ display: 'flex', textAlign: 'center', marginLeft: '100px', marginTop: '20px', marginBottom: '40px', borderBottom: '3px solid rgb(110, 7, 7)', width: '500px', padding: '3px' }}>
                        <h3 style={{ marginLeft: '175px' }}>All Tasks</h3>
                    </div>

                    {isSuccess && (
                        <div className="delete-message" style={{ textAlign: 'center', color: 'white', border: 'solid red', backgroundColor: '#804a497a', borderRadius: '10px', marginLeft: '80px', width: '60%' }}>
                            <div>
                                <h3>Success!</h3>
                                <p style={{ marginBottom: '20px' }}>Your task has been successfully deleted.</p>
                            </div>
                        </div>
                    )}

                    {/* Filter for tasks assigned by/to the user */}
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <label htmlFor="assignedFilter" style={{ color: 'white' }}>Show: </label>
                        <select
                            id="assignedFilter"
                            style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '50px', fontSize: '15px', cursor: 'pointer' }}
                            value={assignedFilter}
                            onChange={(e) => setAssignedFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="assignedByMe">Tasks Assigned By Me</option>
                            <option value="assignedToMe">Tasks Assigned To Me</option>
                            <option value="both">My Personal Tasks</option> 
                        </select>
                    </div>

                    {/* Filter Dropdown */}
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <label htmlFor="taskFilter" style={{ color: 'white' }}>Filter Tasks: </label>
                        <select 
                            style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '50px', fontSize: '15px', cursor: 'pointer' }} 
                            onChange={(e) => setFilter(e.target.value)} 
                            id="taskFilter" 
                            value={filter}
                        >
                            <option value="all">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Display Tasks */}
                    <div className="task-list-container" style={{ marginBottom: '20px' }}>
                        {tasksToDisplay.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <p style={{ color: 'White', fontSize: '20px' }}>No tasks available.</p>
                            </div>
                        ) : (
                            tasksToDisplay.map(task => (
                                <div key={task.id} className="task-item">
                                    <h4><strong>ID: </strong>{task.id}<strong style={{display: 'flex', justifyContent: 'end'}}>Assigned By: {task.author} </strong></h4>
                                    <h4><strong>TITLE: </strong>{task.title}</h4>
                                    <p><strong>DESCRIPTION: </strong>{task.description}</p>
                                    <p><strong>STATUS:</strong> {task.status}</p>
                                    <p><strong>DUE DATE:</strong> {new Date(task.dueDate).toLocaleString()}</p>
                                    <p><strong>Assigned To: </strong>{task.assignedTo}</p>
                                    <button onClick={() => editTask(task)}>Edit</button>
                                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                </div>
                            ))
                        )}
                    </div>

                    <button onClick={downloadPDF} style={{ backgroundColor: 'rgba(201, 19, 19, 0.767)', marginLeft: '20px', borderRadius: '50px', color: 'rgb(214, 212, 201)' }}>Download to PDF</button> 
                    <button onClick={closeModal} style={{ marginLeft: '150px', backgroundColor: 'rgba(201, 19, 19, 0.767)', borderRadius: '50px', color: 'rgb(214, 212, 201)', paddingLeft: '20px', paddingRight: '20px' }}>Close</button>
                    <button onClick={downloadExcel} style={{ marginLeft: '140px', backgroundColor: 'rgba(201, 19, 19, 0.767)', borderRadius: '50px', color: 'rgb(214, 212, 201)' }}>Download to Excel</button>
                </div>
            </div>
        )
    );
}

export default TaskListModal;
