import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SHEETDB_URL } from "../config";

// View & filter tasks in a responsive grid; supports marking a task complete
const ViewTasks = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    AssignedTo: [],
    Priority: "",
    Realm: "",
    Type: "",
    startDate: "",
    endDate: "",
    sortBy: "date", // "date" | "priority"
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const peopleOptions = ["Steve", "Liz", "Caty", "Matt", "Tess", "All", "Other"];
  const realmOptions = [
    "Auto",
    "Clothing",
    "College",
    "Computer",
    "Computing",
    "Finance",
    "Gifts",
    "Health",
    "Home",
    "Learning",
    "Misc",
    "School",
    "Sports",
  ];
  const typeOptions = ["Chore", "Expense", "Task"];

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters((prev) => {
        const list = new Set(prev.AssignedTo);
        if (checked) list.add(value);
        else list.delete(value);
        return { ...prev, AssignedTo: Array.from(list) };
      });
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchFilteredTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SHEETDB_URL}?sheet=Items`);
      const data = await res.json();

      let filtered = data.filter((task) => {
        const assignedOk =
          filters.AssignedTo.length === 0 ||
          filters.AssignedTo.includes(task.AssignedTo);
        const priorityOk = !filters.Priority || `${task.Priority}` === `${filters.Priority}`;
        const realmOk = !filters.Realm || task.Realm === filters.Realm;
        const typeOk = !filters.Type || task.Type === filters.Type;
        const nextDue = task.NextDue || task.TaskDate; // TaskDate used for one-offs
        const dateOk =
          (!filters.startDate || (nextDue && new Date(nextDue) >= new Date(filters.startDate))) &&
          (!filters.endDate || (nextDue && new Date(nextDue) <= new Date(filters.endDate)));
        return assignedOk && priorityOk && realmOk && typeOk && dateOk;
      });

      // sort
      if (filters.sortBy === "priority") {
        filtered.sort((a, b) => {
          const pa = parseInt(a.Priority || 999, 10);
          const pb = parseInt(b.Priority || 999, 10);
          return pa - pb; // 1 (high) .. 5 (low)
        });
      } else {
        filtered.sort((a, b) => {
          const da = new Date(a.NextDue || a.TaskDate || "2100-01-01");
          const db = new Date(b.NextDue || b.TaskDate || "2100-01-01");
          return da - db;
        });
      }

      setTasks(filtered);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (task) => {
    const completedDate = prompt(
      "Enter completion date (YYYY-MM-DD)",
      new Date().toISOString().split("T")[0]
    );
    if (!completedDate) return;
    const completedBy = prompt("Who completed it?", task.AssignedTo || "Steve");
    const cost = prompt("Cost?");
    const notes = prompt("Notes?");

    try {
      // 1) Find next ID from Completions
      const listRes = await fetch(`${SHEETDB_URL}?sheet=Completions`);
      const list = await listRes.json();
      let nextId = 1;
      if (Array.isArray(list) && list.length > 0) {
        const ids = list
          .map((r) => parseInt(r.ID, 10))
          .filter((n) => !Number.isNaN(n));
        if (ids.length > 0) nextId = Math.max(...ids) + 1;
      }

      // 2) Build record using EXACT header names in your sheet
      const completionRecord = {
        ID: String(nextId),
        "Item ID": task.ID, // matches your Completions header
        "Completed By": completedBy,
        "Completed Date": completedDate,
        Cost: cost || "",
        Notes: notes || "",
      };

      // 3) POST to Completions
      const postRes = await fetch(`${SHEETDB_URL}?sheet=Completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [completionRecord] }),
      });
      if (!postRes.ok) {
        const text = await postRes.text();
        throw new Error(`POST failed ${postRes.status}: ${text}`);
      }

      alert("Marked complete!");
    } catch (err) {
      console.error("Failed to record completion:", err);
      alert("Failed to record completion. Check console for details.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">View Tasks</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <fieldset className="border p-3 rounded">
          <legend className="font-semibold">Filter by Person</legend>
          {peopleOptions.map((person) => (
            <label key={person} className="block">
              <input
                type="checkbox"
                name="AssignedTo"
                value={person}
                checked={filters.AssignedTo.includes(person)}
                onChange={handleFilterChange}
              />{" "}
              {person}
            </label>
          ))}
        </fieldset>

        <div>
          <label className="block">Realm:
            <select
              name="Realm"
              value={filters.Realm}
              onChange={handleFilterChange}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Any --</option>
              {realmOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="block mt-2">Type:
            <select
              name="Type"
              value={filters.Type}
              onChange={handleFilterChange}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Any --</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block mt-2">Priority:
            <select
              name="Priority"
              value={filters.Priority}
              onChange={handleFilterChange}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Any --</option>
              {[1, 2, 3, 4, 5].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="block">Start Date:
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full border p-2 rounded"
              />
            </label>
            <label className="block">End Date:
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full border p-2 rounded"
              />
            </label>
          </div>

          <label className="block mt-2">Sort By:
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full border p-2 rounded"
            >
              <option value="date">Due Date (earliest)</option>
              <option value="priority">Priority (1 → 5)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={fetchFilteredTasks}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Home
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-600">No tasks match your filters yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <div key={task.ID} className="p-4 rounded-2xl shadow bg-white border">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">
                  {task.Description || task.TaskName || `Task ${task.ID}`}
                </h3>
                <span className="text-xs bg-gray-100 border px-2 py-0.5 rounded">
                  P{task.Priority || "-"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Type:</strong> {task.Type || "-"} | <strong>Realm:</strong> {task.Realm || "-"} |
                {" "}
                <strong>Subrealm:</strong> {task.Room_Subrealm || "-"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Assigned To:</strong> {task.AssignedTo || "-"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Due:</strong> {task.NextDue || task.TaskDate || "N/A"}
              </p>
              <button
                onClick={() => markComplete(task)}
                className="mt-3 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Mark Complete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewTasks;
