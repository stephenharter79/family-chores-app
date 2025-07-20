import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SHEETDB_URL } from './config';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${SHEETDB_URL}/search?sheet=Items`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Family Chores & Projects</h1>
      <AddTaskForm refreshTasks={fetchTasks} />
      <TaskList tasks={tasks} refreshTasks={fetchTasks} />
    </div>
  );
}

export default App;
