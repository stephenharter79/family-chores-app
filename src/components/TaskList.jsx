import React from 'react';
import CompleteButton from './CompleteButton';

const TaskList = ({ tasks, refreshTasks }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.ID} className="p-4 bg-white rounded-xl shadow-md">
          <div className="text-lg font-semibold">{task.Description}</div>
          <div className="text-sm text-gray-600">
            <strong>Assigned To:</strong> {task.AssignedTo} | <strong>Next Due:</strong> {task.NextDue} | <strong>Budget:</strong> {task.Budget}
          </div>
          <CompleteButton task={task} refreshTasks={refreshTasks} />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
