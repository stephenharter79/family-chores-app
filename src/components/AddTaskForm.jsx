// src/components/AddTaskForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTaskForm = ({ onAddTask }) => {
  const [formData, setFormData] = useState({
    TaskName: "",
    Type: "Chore",
    Realm: "Home",
    Room_Subrealm: "",
    Frequency_days: "",
    TaskDate: "",
    AssignedTo: "Steve",
    Budget: "",
    Notes: "",
    Priority: "3",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddTask(formData);
      alert("Task successfully added!");
      navigate("/"); // back to home
    } catch (err) {
      alert("Failed to add task. See console for details.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="TaskName"
          placeholder="Task Name"
          value={formData.TaskName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="Type"
          value={formData.Type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {["Chore", "Expense", "Task"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          name="Realm"
          value={formData.Realm}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {[
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
          ].map((realm) => (
            <option key={realm} value={realm}>
              {realm}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="Room_Subrealm"
          placeholder="Room or Subrealm"
          value={formData.Room_Subrealm}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="Frequency_days"
          placeholder="Frequency in days"
          value={formData.Frequency_days}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="TaskDate"
          value={formData.TaskDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="AssignedTo"
          value={formData.AssignedTo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {["Steve", "Liz", "Caty", "Matt", "Tess", "All", "Other"].map(
            (person) => (
              <option key={person} value={person}>
                {person}
              </option>
            )
          )}
        </select>

        <select
          name="Priority"
          value={formData.Priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {[1, 2, 3, 4, 5].map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="Budget"
          placeholder="Budget (optional)"
          value={formData.Budget}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="Notes"
          placeholder="Notes"
          value={formData.Notes}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
