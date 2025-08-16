import React, { useState, useEffect } from "react";
import axios from "axios";

const SHEETDB_URL = "https://sheetdb.io/api/v1/tltoey88bbdu6";

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    axios.get(`${SHEETDB_URL}/search?sheet=Tasks`)
      .then((res) => {
        setTasks(res.data);

        // Extract unique people assigned to tasks
        const uniquePeople = Array.from(
          new Set(res.data.map((task) => task.Person).filter(Boolean))
        );
        setPeople(uniquePeople);
      })
      .catch((err) => console.error("Error loading tasks:", err));
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const personMatch = selectedPerson ? task.Person === selectedPerson : true;
    const priorityMatch = priorityFilter ? task.Priority === priorityFilter : true;
    const dateMatch = dateFilter ? new Date(task.NextDue) <= new Date(dateFilter) : true;
    return personMatch && priorityMatch && dateMatch;
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>

      {/* Person filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedPerson("")}
          className={`px-3 py-1 rounded border ${selectedPerson === "" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        {people.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPerson(p)}
            className={`px-3 py-1 rounded border ${
              selectedPerson === p ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Other filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Task table */}
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 border">Task</th>
            <th className="px-3 py-2 border">Person</th>
            <th className="px-3 py-2 border">Due Date</th>
            <th className="px-3 py-2 border">Priority</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">No tasks found.</td>
            </tr>
          ) : (
            filteredTasks.map((task, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-3 py-2 border">{task.Description}</td>
                <td className="px-3 py-2 border">{task.Person}</td>
                <td className="px-3 py-2 border">{task.NextDue}</td>
                <td className="px-3 py-2 border">{task.Priority}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTasks;
