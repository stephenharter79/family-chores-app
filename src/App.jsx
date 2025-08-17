// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddTaskForm from "./components/AddTaskForm";
import ViewTasks from "./pages/ViewTasks";
import { SHEETDB_URL } from "./config";

function App() {
  // handler for adding tasks
  const handleAddTask = async (formData) => {
    try {
      // find next ID from Items
      const listRes = await fetch(`${SHEETDB_URL}?sheet=Items`);
      const list = await listRes.json();
      let nextId = 1;
      if (Array.isArray(list) && list.length > 0) {
        const ids = list
          .map((r) => parseInt(r.ID, 10))
          .filter((n) => !Number.isNaN(n));
        if (ids.length > 0) nextId = Math.max(...ids) + 1;
      }

      // build record
      const taskRecord = {
        ID: String(nextId),
        ...formData,
      };

      // post to Items sheet
      const res = await fetch(`${SHEETDB_URL}?sheet=Items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [taskRecord] }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`POST failed ${res.status}: ${text}`);
      }
    } catch (err) {
      console.error("Failed to add task:", err);
      throw err;
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
