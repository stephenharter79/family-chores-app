// src/components/AddTaskForm.jsx
import React, { useState } from "react";
import { SHEETDB_URL } from "../config";

const realms = [
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

const types = ["Chore", "Task", "Expense"];
const priorities = [1, 2, 3, 4, 5];

export default function AddTaskForm({ onAddTask }) {
  const [formData, setFormData] = useState({
    Realm: realms[0],
    Type: types[0],
    Room_Subrealm: "",
    Description: "",
    AssignedTo: "",
    Frequency_days: "",
    Budget: "",
    BudgetYear: new Date().getFullYear(),
    Priority: 3,
    TaskDate: "",
    Notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // format TaskDate → MM/DD/YYYY
    let formattedDate = formData.TaskDate;
    if (formattedDate) {
      const d = new Date(formData.TaskDate);
      formattedDate =
        (d.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        d.getDate().toString().padStart(2, "0") +
        "/" +
        d.getFullYear();
    }

    const payload = {
      Realm: formData.Realm,
      Type: formData.Type,
      Room_Subrealm: formData.Room_Subrealm,
      Description: formData.Description,
      AssignedTo: formData.AssignedTo,
      Frequency_days: formData.Frequency_days,
      Budget: formData.Budget,
      BudgetYear: formData.BudgetYear || new Date().getFullYear(),
      Priority: formData.Priority,
      TaskDate: formattedDate,
      Notes: formData.Notes,
      // ID, LastDone, LastDoneBy, NextDue, AdjBudget → leave blank
    };

    try {
      const res = await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [payload] }),
      });

      if (res.ok) {
        alert("Task added!");
        if (onAddTask) onAddTask(payload);
      } else {
        console.error("Error submitting task:", res.statusText);
      }
    } catch (err) {
      console.error("Network error submitting task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label>Realm</label>
        <select name="Realm" value={formData.Realm} onChange={handleChange}>
          {realms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Type</label>
        <select name="Type" value={formData.Type} onChange={handleChange}>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Room / Subrealm</label>
        <input
          type="text"
          name="Room_Subrealm"
          value={formData.Room_Subrealm}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Assigned To</label>
        <input
          type="text"
          name="AssignedTo"
          value={formData.AssignedTo}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Frequency (days)</label>
        <input
          type="number"
          name="Frequency_days"
          value={formData.Frequency_days}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Budget ($)</label>
        <input
          type="number"
          name="Budget"
          value={formData.Budget}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Budget Year</label>
        <input
          type="number"
          name="BudgetYear"
          value={formData.BudgetYear}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Priority</label>
        <select
          name="Priority"
          value={formData.Priority}
          onChange={handleChange}
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Task Date</label>
        <input
          type="date"
          name="TaskDate"
          value={formData.TaskDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Notes</label>
        <textarea
          name="Notes"
          value={formData.Notes}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Task
      </button>
    </form>
  );
}
