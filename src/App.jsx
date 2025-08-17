// src/App.jsx
// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import AddTaskForm from "./components/AddTaskForm";
import ViewTasks from "./pages/ViewTasks";
import { SHEETDB_URL } from "./config";

function App() {
  // Handler to add a new task to Items sheet
  const handleAddTask = async (formData) => {
    try {
      // Post to the Items sheet
      await axios.post(`${SHEETDB_URL}?sheet=Items`, {
        data: [formData],
      });
      alert("Task added!");
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("Error adding task");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-task" element={<AddTaskForm onAddTask={handleAddTask} />} />
          <Route path="/view-tasks" element={<ViewTasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
