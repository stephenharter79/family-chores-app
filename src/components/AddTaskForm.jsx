// src/components/AddTaskForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const realmSubrealmMap = {
  Auto: ["Camry07", "Camry14", "Odyssey19", "Other"],
  Clothing: ["Steve"],
  College: ["Caty", "Matt", "Tess"],
  Computer: ["Misc"],
  Computing: ["Chores App", "Misc"],
  Finance: [
    "Budget", "Caty", "Charity", "College", "Guards", "Guitar", "HSA",
    "Investing", "Quicken", "Retirement"
  ],
  Gifts: ["Caty", "Liz", "Matt", "Multiple"],
  Health: ["Steve"],
  Home: [
    "Basement", "Caty", "Dining Room", "Exterior", "Garage", "Ground Bathroom",
    "Hall/Foyer/Steps", "Indoor", "Kids Bathroom", "Kitchen", "Living Room",
    "Master", "Matt", "Multiple", "Office", "Piano Room", "Tess",
    "Upstairs Hall", "Workout Room"
  ],
  Learning: ["Economics", "Investing", "Math", "ML"],
  Misc: ["Misc", "Sports"],
  School: ["Multiple"],
  Sports: ["Cheer", "Soccer"],
};

const validTypes = ["Chore", "Task", "Expense"];
const validPriorities = ["1", "2", "3", "4", "5"];
const validAssignees = ["Steve", "Liz", "Caty", "Matt", "Tess", "All", "Other"];

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
      // reset subrealm if realm changes
      ...(name === "Realm" ? { Room_Subrealm: "" } : {}),
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

    const nextId = await fetchNextId();

    let formattedDate = formData.TaskDate;
    if (formattedDate) {
      const d = new Date(formData.TaskDate);
      formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    const newTask = {
      ID: nextId,
      Realm: formData.Realm,
      Type: formData.Type,
      Room_Subrealm: formData.Room_Subrealm,
      Description: formData.Description,
      AssignedTo: formData.AssignedTo,
      Frequency_days: formData.Frequency_days,
      LastDone: "",
      LastDoneBy: "",
      NextDue: "",
      Budget: formData.Budget,
      BudgetYear: formData.BudgetYear,
      AdjBudget: "",
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
        navigate("/"); // return home
      } else {
        alert("Error adding task");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error posting task");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 max-w-md mx-auto bg-white shadow rounded"
    >
      {/* Type */}
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          name="Type"
          value={formData.Type}
          onChange={handleChange}
          required
          className="border p-1 w-full rounded"
        >
          <option value="">Select Type</option>
          {validTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Realm */}
      <div>
        <label className="block text-sm font-medium">Realm</label>
        <select
          name="Realm"
          value={formData.Realm}
          onChange={handleChange}
          required
          className="border p-1 w-full rounded"
        >
          <option value="">Select Realm</option>
          {validRealms.map((realm) => (
            <option key={realm} value={realm}>
              {realm}
            </option>
          ))}
        </select>
      </div>

      {/* Subrealm */}
      <div>
        <label className="block text-sm font-medium">Room/Subrealm</label>
        <select
          name="Room_Subrealm"
          value={formData.Room_Subrealm}
          onChange={handleChange}
          disabled={!formData.Realm}
          className="border p-1 w-full rounded"
        >
          <option value="">Select Subrealm</option>
          {formData.Realm &&
            realmSubrealmMap[formData.Realm].map((sr) => (
              <option key={sr} value={sr}>
                {sr}
              </option>
            ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          required
          className="border p-1 w-full rounded"
        />
      </div>

      {/* Assigned To */}
      <div>
        <label className="block text-sm font-medium">Assigned To</label>
        <select
          name="AssignedTo"
          value={formData.AssignedTo}
          onChange={handleChange}
          className="border p-1 w-full rounded"
        >
          <option value="">Select Person</option>
          {validAssignees.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium">Frequency (days)</label>
        <input
          type="number"
          name="Frequency_days"
          value={formData.Frequency_days}
          onChange={handleChange}
          className="border p-1 w-full rounded"
        />
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium">Budget ($)</label>
        <input
          type="number"
          name="Budget"
          value={formData.Budget}
          onChange={handleChange}
          className="border p-1 w-full rounded"
        />
      </div>

      {/* Budget Year */}
      <div>
        <label className="block text-sm font-medium">Budget Year</label>
        <input
          type="number"
          name="BudgetYear"
          value={formData.BudgetYear}
          onChange={handleChange}
          className="border p-1 w-full rounded"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium">Priority (1=High, 5=Low)</label>
        <select
          name="Priority"
          value={formData.Priority}
          onChange={handleChange}
          required
          className="border p-1 w-full rounded"
        >
          {validPriorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Task Date */}
      <div>
        <label className="block text-sm font-medium">Task Date</label>
        <input
          type="date"
          name="TaskDate"
          value={formData.TaskDate}
          onChange={handleChange}
          className="border p-1 w-full rounded"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          name="Notes"
          value={formData.Notes}
          onChange={handleChange}
          className="border p-1 w-full rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
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
          className="bg-gray-400 text-white px-4 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
