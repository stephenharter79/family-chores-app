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
    Budget: '$0',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(SHEETDB_URL, {
      data: [form],
      sheet: 'Items',
    });
    refreshTasks();
    setForm({ Realm: '', Type: '', Room_Subrealm: '', Description: '', AssignedTo: '', Frequency_days: '', Budget: '$0' });
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
