import React, { useEffect, useState } from "react";
import axios from "axios";

const SHEETDB_API = "https://sheetdb.io/api/v1/tltoey88bbdu6";

export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [filterPerson, setFilterPerson] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    axios.get(`${SHEETDB_API}/search?sheet=Tasks`).then((res) => {
      setTasks(res.data);
    });
  }, []);

  const markComplete = async (task) => {
    try {
      const res = await axios.get(`${SHEETDB_API}/search?sheet=Completions`);
      const completions = res.data;
      const nextId =
        completions.length > 0
          ? Math.max(...completions.map((c) => parseInt(c.ID || 0))) + 1
          : 1;

      await axios.post(`${SHEETDB_API}?sheet=Completions`, {
        data: [
          {
            ID: nextId,
            TaskID: task.ID,
            Date: new Date().toISOString().split("T")[0],
            DoneBy: "Someone",
            Notes: "",
            Cost: "",
          },
        ],
      });

      alert(`Marked task "${task.Description}" complete!`);
    } catch (err) {
      console.error("Error marking complete:", err);
      alert("Failed to mark task complete");
    }
  };

  const filteredTasks = tasks
    .filter((task) =>
      filterPerson ? task.AssignedTo?.toLowerCase() === filterPerson.toLowerCase() : true
    )
    .filter((task) =>
      filterPriority ? task.Priority?.toLowerCase() === filterPriority.toLowerCase() : true
    )
    .filter((task) =>
      filterDate ? task.NextDue === filterDate : true
    );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const order = { high
