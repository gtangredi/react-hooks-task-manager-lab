import React, { createContext, useState } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);

    function loadTasks(initialTasks) {
        setTasks(initialTasks);
    }

    function addTask({ title, completed = false}) {
        const newTask = {  title, completed };
        fetch("http://localhost:6001/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        })
            .then((r) => r.json())
            .then((createdTask) => {
                setTasks([...tasks, createdTask]);
            })
            .catch((error) => console.error("Error adding task:", error));
    }

    function toggleComplete(taskId) {
        const task = tasks.find((t) => t.id === taskId);
        fetch(`http://localhost:6001/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: !task.completed }),
        })
            .then((r) => r.json())
            .then(() => {
                setTasks(
                    tasks.map((task) =>
                        task.id === taskId ? { ...task, completed: !task.completed } : task
                    )
                );
            })
            .catch((error) => console.error("Error updating task:", error));

    }

    function searchTasks(query) {
        return tasks.filter((task) =>
            task.title.toLowerCase().includes(query.toLowerCase())
        );
    }

    return (
        <TaskContext.Provider
            value={{ tasks, loadTasks, addTask, toggleComplete, searchTasks }}
        >
            {children}
        </TaskContext.Provider>
    );
}
