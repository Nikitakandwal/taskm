import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await axios.post('/tasks', taskData);
      setTasks([response.data, ...tasks]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await axios.put(`/tasks/${id}`, taskData);
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, ...taskData } : task
        )
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    }
  };

  const toggleTaskCompletion = async (id) => {
    const taskToUpdate = tasks.find(task => task._id === id);
    if (!taskToUpdate) throw new Error('Task not found');
    
    const newCompletionStatus = !taskToUpdate.completed;
     
    setTasks(tasks.map(task => 
      task._id === id ? { ...task, completed: newCompletionStatus } : task
    ));
    
    try {
      await axios.patch(`/tasks/${id}/completion`, {
        completed: newCompletionStatus
      });
    } catch (err) { 
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, completed: taskToUpdate.completed } : task
      ));
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;