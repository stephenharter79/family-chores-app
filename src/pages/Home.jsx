import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Family Chores App</h1>
      <div className="space-x-4">
        <Link
          to="/add-task"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </Link>
        <Link
          to="/view-tasks"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          View Tasks
        </Link>
      </div>
    </div>
  );
};

export default Home;
