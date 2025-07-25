import React, { useState } from 'react';
import axios from 'axios';
import { SHEETDB_URL } from '../config';

const AddTaskForm = ({ refreshTasks }) => {
  const [form, setForm] = useState({
    Realm: '',
    Type: '',
    Room_Subrealm: '',
    Description: '',
    AssignedTo: '',
    Frequency_days: '',
    LastDone: '',
    LastDoneBy: '',
    Budget: '$0',
    BudgetYear: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      // Fetch existing tasks
      const res = await axios.get(`${SHEETDB_URL}?sheet=Items`);
      const tasks = res.data;

      // Find highest existing ID
      const maxID = tasks.reduce((max, task) => {
        const id = parseInt(task.ID);
        return isNaN(id) ? max : Math.max(max, id);
      }, 0);

      // Build the form data with the next ID
      const newTask = {
        ...form,
        ID: (maxID + 1).toString(), //SheetDB stores all fields as strings
        NextDue: `=INDIRECT("G"&ROW())+INDIRECT("H"&ROW())`,
        AdjBudget: `=POWER(1.04,YEAR(TODAY())-2025)*INDIRECT("K"&ROW())`,
      };

      // Submit to SheetDB
      await axios.post(SHEETDB_URL, {
        data: [newTask],
        sheet: 'Items',
      });

      refreshTasks();

      // Reset form
      setForm({
        Realm: '',
        Type: '',
        Room_Subrealm: '',
        Description: '',
        AssignedTo: '',
        Frequency_days: '',
        LastDone: '',
        LastDoneBy: '',
        Budget: '$0',
        BudgetYear: '',
      });
    } catch (error) {
      console.error('Error adding task:', error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4">
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={form[key]}
          onChange={handleChange}
          placeholder={key.replace('_', ' ')}
          className="p-2 border rounded"
        />
      ))}
      <button className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;
