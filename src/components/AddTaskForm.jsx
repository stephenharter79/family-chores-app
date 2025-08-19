// src/components/AddTaskForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // 👈 import navigate

const SHEETDB_API = "https://sheetdb.io/api/v1/tltoey88bbdu6"; // your endpoint

const validRealms = [
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

const validTypes = ["Chore", "Task", "Expense"];
const validPriorities = ["1", "2", "3", "4", "5"];

export default function AddTaskForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Realm: "",
    Type: "",
    Room_Subrealm: "",
    Description: "",
    AssignedTo: "",
    Frequency_days: "",
    Budget: "",
    BudgetYear: new Date().getFullYear(),
    Priority: "3",
    TaskDate: "",
    Notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchNextId = async () => {
    const res = await fetch(`${SHEETDB_API}?sheet=Items`);
    const rows = await res.json();

    const ids = rows
      .map((row) => Number(row.ID))
      .filter((id) => !isNaN(id) && id > 0);

    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!validRealms.includes(formData.Realm)) {
      alert(`Realm must be one of: ${validRealms.join(", ")}`);
      return;
    }
    if (!validTypes.includes(formData.Type)) {
      alert(`Type must be one of: ${validTypes.join(", ")}`);
      return;
    }
    if (!validPriorities.includes(formData.Priority)) {
      alert(`Priority must be one of: ${validPriorities.join(", ")}`);
      return;
    }

    // Get next ID
    const nextId = await fetchNextId();

    // Format date MM/DD/YYYY
    let formattedDate = formData.TaskDate;
    if (formattedDate) {
      const d = new Date(formData.TaskDate);
      formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    // Build row (leave formula columns blank)
    const newTask = {
      ID: nextId,
      Realm: formData.Realm,
      Type: formData.Type,
      Room_Subrealm: formData.Room_Subrealm,
      Description: formData.Description,
      AssignedTo: formData.AssignedTo,
      Frequency_days: formData.Frequency_days,
      LastDone: "", // formula in sheet
      LastDoneBy: "", // formula in sheet
      NextDue: "", // formula in sheet
      Budget: formData.Budget,
      BudgetYear: formData.BudgetYear,
      AdjBudget: "", // formula in sheet
      Priority: formData.Priority,
      TaskDate: formattedDate,
      Notes: formData.Notes,
    };

    try {
      const response = await fetch(SHEETDB_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [newTask] }),
      });

      if (response.ok) {
        alert("Task added!");
        setFormData({
          Realm: "",
          Type: "",
          Room_Subrealm: "",
          Description: "",
          AssignedTo: "",
          Frequency_days: "",
          Budget: "",
          BudgetYear: new Date().getFullYear(),
          Priority: "3",
          TaskDate: "",
          Notes: "",
        });
      } else {
        alert("Error adding task");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error posting task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        name="Description"
        placeholder="Description"
        value={formData.Description}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <select
        name="Realm"
        value={formData.Realm}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      >
        <option value="">Select Realm</option>
        {validRealms.map((realm) => (
          <option key={realm} value={realm}>
            {realm}
          </option>
        ))}
      </select>
      <select
        name="Type"
        value={formData.Type}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      >
        <option value="">Select Type</option>
        {validTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="Room_Subrealm"
        placeholder="Room/Subrealm"
        value={formData.Room_Subrealm}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="AssignedTo"
        placeholder="Assigned To"
        value={formData.AssignedTo}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="Frequency_days"
        placeholder="Frequency (days)"
        value={formData.Frequency_days}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="Budget"
        placeholder="Budget (in dollars)"
        value={formData.Budget}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="BudgetYear"
        placeholder="Budget Year"
        value={formData.BudgetYear}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <select
        name="Priority"
        value={formData.Priority}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      >
        {validPriorities.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="TaskDate"
        value={formData.TaskDate}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <textarea
        name="Notes"
        placeholder="Notes"
        value={formData.Notes}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Are you sure you want to cancel?")) {
              navigate("/");
            }
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
