import React, { useState, useEffect } from 'react';
import './App.css';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('Medium'); // Default priority
    const [newTaskDueDate, setNewTaskDueDate] = useState(''); // New state for due date
    const [newTaskCategory, setNewTaskCategory] = useState('Work'); // New state for category
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
    const [editTaskPriority, setEditTaskPriority] = useState('Medium'); // Default priority for editing
    const [editTaskDueDate, setEditTaskDueDate] = useState(''); // New state for editing due date
    const [editTaskCategory, setEditTaskCategory] = useState('Work'); // New state for editing category
    const [selectedCategory, setSelectedCategory] = useState('All'); // State for filtering tasks
    const [isDarkMode, setIsDarkMode] = useState(false);

    const categories = ['Work', 'Personal', 'Shopping']; // Define categories

    useEffect(() => {
        // Request permission for notifications
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
    };

    const checkDueDates = () => {
        const now = new Date();
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        tasks.forEach(task => {
            if (task.dueDate && new Date(task.dueDate) <= oneDayFromNow && !task.completed) {
                new Notification(`Reminder: Task "${task.text}" is due soon!`, {
                    body: `Due Date: ${task.dueDate}`,
                });
            }
        });
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            checkDueDates();
        }, 3600000); // Check every hour

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [tasks]);

    const handleAddTask = () => {
        if (newTask.trim() === '') return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, priority: newTaskPriority, dueDate: newTaskDueDate, category: newTaskCategory }]);
        setNewTask('');
        setNewTaskPriority('Medium'); // Reset priority to default
        setNewTaskDueDate(''); // Reset due date
        setNewTaskCategory('Work'); // Reset category to default
    };

    const handleToggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleEditTask = (id, text, priority, dueDate, category) => {
        setEditTaskId(id);
        setEditTaskText(text);
        setEditTaskPriority(priority);
        setEditTaskDueDate(dueDate); // Set the due date for editing
        setEditTaskCategory(category); // Set the category for editing
    };

    const handleUpdateTask = () => {
        if (editTaskText.trim() === '') return;
        setTasks(tasks.map(task =>
            task.id === editTaskId ? { ...task, text: editTaskText, priority: editTaskPriority, dueDate: editTaskDueDate, category: editTaskCategory } : task
        ));
        setEditTaskId(null);
        setEditTaskText('');
        setEditTaskPriority('Medium'); // Reset priority to default
        setEditTaskDueDate(''); // Reset due date
        setEditTaskCategory('Work'); // Reset category to default
    };

    // Filter tasks based on selected category
    const filteredTasks = selectedCategory === 'All' ? tasks : tasks.filter(task => task.category === selectedCategory);

    return (
        <div>
            <h1>Todo List</h1>
            <button onClick={toggleDarkMode}>
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            <div>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder=" Add a new task..."
                />
                <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
                <select value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)}>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <button onClick={handleAddTask}>Add Task</button>
            </div>
            <div>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="All">All</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <ul>
                {filteredTasks.map(task => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        <div>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id)}
                            />
                            {editTaskId === task.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editTaskText}
                                        onChange={(e) => setEditTaskText(e.target.value)}
                                    />
                                    <select value={editTaskPriority} onChange={(e) => setEditTaskPriority(e.target.value)}>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={editTaskDueDate}
                                        onChange={(e) => setEditTaskDueDate(e.target.value)}
                                    />
                                    <select value={editTaskCategory} onChange={(e) => setEditTaskCategory(e.target.value)}>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <>
                                    {task.text} - <strong>{task.priority}</strong> - Due: <strong>{task.dueDate}</strong> - Category: <strong>{task.category}</strong>
                                </>
                            )}
                        </div>
                        {editTaskId === task.id ? (
                            <button onClick={handleUpdateTask}>Update</button>
                        ) : (
                            <button onClick={() => handleEditTask(task.id, task.text, task.priority, task.dueDate, task.category)}>Edit</button>
                        )}
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;