import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewTasks = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    AssignedTo: [],
    Priority: "",
    Realm: "",
    Type: "",
    startDate: "",
    endDate: "",
    sortBy: "date",
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const peopleOptions = ["Steve", "Liz", "Caty", "Matt", "Tess", "All", "Other"];
  const realmOptions = ["Auto","Clothing","College","Computer","Computing","Finance","Gifts","Health","Home","Learning","Misc","School","Sports"];
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
      const response = await fetch("https://sheetdb.io/api/v1/tltoey88bbdu6");
      const data = await response.json();
      let filtered = data.filter((task) => {
        const assignedOk =
          filters.AssignedTo.length === 0 ||
          filters.AssignedTo.includes(task.AssignedTo);
        const priorityOk = !filters.Priority || task.Priority === filters.Priority;
        const realmOk = !filters.Realm || task.Realm === filters.Realm;
        const typeOk = !filters.Type || task.Type === filters.Type;
        const nextDue = task.NextDue || task.TaskDate;
        const dateOk =
          (!filters.startDate || new Date(nextDue) >= new Date(filters.startDate)) &&
          (!filters.endDate || new Date(nextDue) <= new Date(filters.endDate));
        return assignedOk && priorityOk && realmOk && typeOk && dateOk;
      });

      if (filters.sortBy === "priority") {
        filtered.sort((a, b) => parseInt(a.Priority || 5) - parseInt(b.Priority || 5));
      } else {
        filtered.sort((a, b) => new Date(a.NextDue || a.TaskDate) - new Date(b.NextDue || b.TaskDate));
      }

      setTasks(filtered);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
    setLoading(false);
  };

  const markComplete = async (task) => {
    const completedDate = prompt("Enter completion date (YYYY-MM-DD)", new Date().toISOString().split("T")[0]);
    if (!completedDate) return;
    const completedBy = prompt("Who completed it?", "Steve");
    const cost = prompt("Cost?");
    const notes = prompt("Notes?");

    // Fetch completions to find max ID
    const completionsRes = await fetch(
      "https://sheetdb.io/api/v1/tltoey88bbdu6?sheet=Completions"
    );

    const completionsData = await completionsRes.json();

    let newId = 1;
    if (completionsData.length > 0) {
      const ids = completionsData
        .map((row) => parseInt(row.ID, 10))
        .filter((id) => !isNaN(id));
      newID = Math.max(...ids) + 1;
    }

    const completionRecord = {
      ID: newID,
      TaskID: task.ID,
      CompletedDate: completedDate,
      CompletedBy: completedBy,
      Cost: cost,
      Notes: notes,
    };

    try {
      await fetch("https://sheetdb.io/api/v1/tltoey88bbdu6?sheet=Completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [completionRecord] }),
      });
      alert("Marked complete!");
    } catch (err) {
      alert("Failed to record completion.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">View Tasks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <fieldset className="border p-2 rounded">
          <legend className="font-semibold">Filter by Person</legend>
          {peopleOptions.map((person) => (
            <label key={person} className="block">
              <input
                type="checkbox"
                name="AssignedTo"
                value={person}
                checked={filters.AssignedTo.includes(person)}
                onChange={handleFilterChange}
              /> {person}
            </label>
          ))}
        </fieldset>

        <div>
          <label className="block">Realm:
            <select name="Realm" value={filters.Realm} onChange={handleFilterChange} className="w-full border p-2 rounded">
              <option value="">-- Any --</option>
              {realmOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>

          <label className="block mt-2">Type:
            <select name="Type" value={filters.Type} onChange={handleFilterChange} className="w-full border p-2 rounded">
              <option value="">-- Any --</option>
              {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label className="block mt-2">Priority:
            <select name="Priority" value={filters.Priority} onChange={handleFilterChange} className="w-full border p-2 rounded">
              <option value="">-- Any --</option>
              {[1,2,3,4,5].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <label className="block mt-2">Start Date:
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full border p-2 rounded" />
          </label>
          <label className="block mt-2">End Date:
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full border p-2 rounded" />
          </label>

          <label className="block mt-2">Sort By:
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="w-full border p-2 rounded">
              <option value="date">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={fetchFilteredTasks} className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
        <button onClick={() => navigate("/")} className="bg-gray-300 px-4 py-2 rounded">Home</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.ID} className="border p-4 rounded shadow">
              <div className="font-bold text-lg">{task.TaskName}</div>
              <div className="text-sm text-gray-700 italic">{task.Type} | {task.Realm} | {task.Subrealm}</div>
              <div className="text-sm mt-1">{task.Description}</div>
              <div className="text-sm text-gray-600 mt-1">Due: {task.NextDue || task.TaskDate}</div>
              <button onClick={() => markComplete(task)} className="mt-2 bg-green-500 text-white px-3 py-1 rounded">Mark Complete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewTasks;
