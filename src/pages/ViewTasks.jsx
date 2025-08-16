import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

const SHEETDB_API = "https://sheetdb.io/api/v1/tltoey88bbdu6";

export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [sortBy, setSortBy] = useState("date"); // default sort by date

  useEffect(() => {
    axios.get(`${SHEETDB_API}/TaskList`).then((response) => {
      setTasks(response.data);
    });
  }, []);

  const markComplete = async (task) => {
    try {
      const response = await axios.get(`${SHEETDB_API}/Completions`);
      const completions = response.data;

      // compute next ID
      const maxId = completions.length
        ? Math.max(...completions.map((c) => parseInt(c.ID || 0)))
        : 0;
      const nextId = maxId + 1;

      const completion = {
        ID: nextId,
        TaskID: task.ID,
        CompletedBy: selectedPerson,
        CompletedDate: new Date().toISOString().split("T")[0],
        Notes: "",
        Cost: "",
      };

      await axios.post(`${SHEETDB_API}/Completions`, completion);
      alert("Task marked complete!");
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Error completing task");
    }
  };

  // get unique people from AssignedTo column
  const people = [...new Set(tasks.map((t) => t.AssignedTo).filter(Boolean))];

  // filter tasks by selected person
  let filteredTasks = selectedPerson
    ? tasks.filter((t) => t.AssignedTo === selectedPerson)
    : tasks;

  // sorting
  filteredTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.NextDue || a.TaskDate || "2100-01-01") -
             new Date(b.NextDue || b.TaskDate || "2100-01-01");
    } else if (sortBy === "priority") {
      return (b.Priority || 0) - (a.Priority || 0);
    }
    return 0;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Tasks</h1>

      {/* Person filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {people.map((person) => (
          <button
            key={person}
            className={`px-3 py-1 rounded-lg ${
              selectedPerson === person
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedPerson(person)}
          >
            {person}
          </button>
        ))}
        <button
          className={`px-3 py-1 rounded-lg ${
            !selectedPerson ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedPerson(null)}
        >
          All
        </button>
      </div>

      {/* Sort controls */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="date">Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Task cards in responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.ID} className="p-4 rounded-2xl shadow bg-white">
            <h2 className="text-lg font-semibold">{task.Description}</h2>
            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {task.Type} | <strong>Realm:</strong>{" "}
              {task.Realm} | <strong>Subrealm:</strong> {task.Room_Subrealm} |{" "}
              <strong>Room:</strong> {task.Room} |{" "}
              <strong>Subroom:</strong> {task.Subroom}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Due:</strong> {task.NextDue || task.TaskDate || "N/A"} |{" "}
              <strong>Priority:</strong> {task.Priority}
            </p>
            <button
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={() => markComplete(task)}
            >
              Mark Complete
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
