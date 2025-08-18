// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddTaskForm from "./components/AddTaskForm";
import ViewTasks from "./pages/ViewTasks";
import { SHEETDB_URL } from "./config";

function App() {
  // function to actually POST a new task
  const addTask = async (task) => {
    try {
      // fetch current items so we can compute next ID
      const res = await fetch(`${SHEETDB_URL}?sheet=Items`);
      const items = await res.json();

      let nextId = 1;
      if (Array.isArray(items) && items.length > 0) {
        const ids = items
          .map((r) => parseInt(r.ID, 10))
          .filter((n) => !Number.isNaN(n));
        if (ids.length > 0) nextId = Math.max(...ids) + 1;
      }

      const record = {
        ID: String(nextId),
        ...task,
      };

      const postRes = await fetch(`${SHEETDB_URL}?sheet=Items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [record] }),
      });

      if (!postRes.ok) {
        const text = await postRes.text();
        throw new Error(`POST failed ${postRes.status}: ${text}`);
      }

      console.log("✅ Task added:", record);
      return record;
    } catch (err) {
      console.error("❌ Failed to add task:", err);
      throw err;
    }
  };

  console.log("Rendering App, addTask is:", addTask);

return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/add-task"
            element={
              <AddTaskForm
                onAddTask={(task) => {
                  console.log("Prop test fired:", task);
                  return addTask(task);
                }}
              />
            }
          />
          <Route path="/view-tasks" element={<ViewTasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

//  console.log("App rendering, addTask is defined?", !!addTask);

