 
import axios from 'axios';

export const getTasks = async () => {
  const response = await axios.get('/tasks');
  return response.data;
};

export const getTask = async (id) => {
  const response = await axios.get(`/tasks/${id}`);
  return response.data;
};

export const addTask = async (taskData) => {
  const response = await axios.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`/tasks/${id}`);
  return response.data;
};