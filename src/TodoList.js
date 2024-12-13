import React, { useState } from 'react';
import './App.css';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('Medium'); // Default priority
    const [newTaskDueDate, setNewTaskDueDate] = useState(''); // New state for due date
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
    const [editTaskPriority, setEditTaskPriority] = useState('Medium'); // Default priority for editing
    const [editTaskDueDate, setEditTaskDueDate] = useState(''); // New state for editing due date

    const handleAddTask = () => {
        if (newTask.trim() === '') return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, priority: newTaskPriority, dueDate: newTaskDueDate }]);
        setNewTask('');
        setNewTaskPriority('Medium'); // Reset priority to default
        setNewTaskDueDate(''); // Reset due date
    };

    const handleToggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleEditTask = (id, text, priority, dueDate) => {
        setEditTaskId(id);
        setEditTaskText(text);
        setEditTaskPriority(priority);
        setEditTaskDueDate(dueDate); // Set the due date for editing
    };

    const handleUpdateTask = () => {
        if (editTaskText.trim() === '') return;
        setTasks(tasks.map(task =>
            task.id === editTaskId ? { ...task, text: editTaskText, priority: editTaskPriority, dueDate: editTaskDueDate } : task
        ));
        setEditTaskId(null);
        setEditTaskText('');
        setEditTaskPriority('Medium'); // Reset priority to default
        setEditTaskDueDate(''); // Reset due date
    };

    return (
        <div>
            <h1>Todo List</h1>
            <div>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
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
                <button onClick={handleAddTask}>Add Task</button>
            </div>
            <ul>
                {tasks.map(task => (
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
                                </>
                            ) : (
                                <>
                                    {task.text} - <strong>{task.priority}</strong> - Due: <strong>{task.dueDate}</strong>
                                </>
                            )}
                        </div>
                        {editTaskId === task.id ? (
                            <button onClick={handleUpdateTask}>Update</button>
                        ) : (
                            <button onClick={() => handleEditTask(task.id, task.text, task.priority, task.dueDate)}>Edit</button>
                        )}
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
