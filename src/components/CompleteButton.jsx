import React from 'react';
import axios from 'axios';
import { SHEETDB_URL } from '../config';

const CompleteButton = ({ task, refreshTasks }) => {
  const handleComplete = async () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    await axios.post(`${SHEETDB_URL}`, {
      data: [
        {
          'Item ID': task.ID,
          'Completed By': task.AssignedTo,
          'Completed Date': todayStr,
          'Notes': 'Marked complete via app',
        },
      ],
      sheet: 'Completions',
    });

    await axios.patch(`${SHEETDB_URL}/ID/${task.ID}`, {
      data: {
        LastDone: todayStr,
        LastDoneBy: task.AssignedTo,
      },
      sheet: 'Items',
    });

    refreshTasks();
  };

  return (
    <button
      className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      onClick={handleComplete}
    >
      Mark Complete
    </button>
  );
};

export default CompleteButton;
