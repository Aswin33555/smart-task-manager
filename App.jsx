import { useEffect, useState } from "react";

export default function TaskManagerApp() {
  const [tasks, setTasks] = useState(() => {

  const savedTasks =
    localStorage.getItem("tasks");

  return savedTasks
    ? JSON.parse(savedTasks)
    : [];

});
  const [taskInput, setTaskInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks automatically
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add or Update Task
  const handleTask = () => {
    if (taskInput.trim() === "") return;

    if (editingId) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingId
          ? { ...task, title: taskInput }
          : task
      );

      setTasks(updatedTasks);
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: taskInput,
        completed: false,
        createdAt: new Date().toLocaleString(),
      };

      setTasks([newTask, ...tasks]);
    }

    setTaskInput("");
  };

  // Delete Task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Toggle Complete
  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    setTasks(updatedTasks);
  };

  // Edit Task
  const editTask = (task) => {
    setTaskInput(task.title);
    setEditingId(task.id);
  };

  // Clear All Tasks
  const clearAllTasks = () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete all tasks?"
    );

    if (confirmDelete) {
      setTasks([]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold">
                🧠 Smart Task Manager
              </h1>

              <p className="text-zinc-400 mt-2">
                Professional React + Tailwind CRUD App
              </p>
            </div>

            <button
              onClick={clearAllTasks}
              className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-2xl font-semibold"
            >
              Clear All
            </button>
          </div>

          {/* Input Section */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="✍️ Enter your task..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleTask}
                className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold"
              >
                {editingId ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-800 rounded-2xl p-5 border border-zinc-700">
              <h2 className="text-zinc-400 text-sm">Total Tasks</h2>
              <p className="text-3xl font-bold mt-2">
                {tasks.length}
              </p>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-5 border border-zinc-700">
              <h2 className="text-zinc-400 text-sm">Completed</h2>
              <p className="text-3xl font-bold mt-2 text-green-400">
                {tasks.filter((task) => task.completed).length}
              </p>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-5 border border-zinc-700">
              <h2 className="text-zinc-400 text-sm">Pending</h2>
              <p className="text-3xl font-bold mt-2 text-yellow-400">
                {
                  tasks.filter((task) => !task.completed)
                    .length
                }
              </p>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="bg-zinc-800 border border-dashed border-zinc-700 rounded-2xl p-10 text-center text-zinc-500 text-lg">
                📭 No Tasks Available
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:border-blue-500 transition"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 mt-1"
                    />

                    <div>
                      <h3
                        className={`text-xl font-semibold ${
                          task.completed
                            ? "line-through text-zinc-500"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="text-zinc-500 text-sm mt-1">
                        Created: {task.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        task.completed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>

                    <button
                      onClick={() => editTask(task)}
                      className="bg-yellow-500 hover:bg-yellow-600 transition px-4 py-2 rounded-xl font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-zinc-500 text-sm">
            💾 Auto Save Enabled using LocalStorage
          </div>
        </div>
      </div>
    </div>
  );
}
