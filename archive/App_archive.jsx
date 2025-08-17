// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import AddTaskForm from '../src/components/AddTaskForm';
import ViewTasks from '../src/pages/ViewTasks';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-task" element={<AddTaskForm />} />
          <Route path="/view-tasks" element={<ViewTasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
