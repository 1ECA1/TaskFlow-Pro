import { useEffect, useState } from "react";

import Header from "../components/Header";
import Button from "../components/Button";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

import { getTasks, createTask, updateTask, deleteTask } from "../services/api";

function Dashboard() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load tasks from Django when Dashboard opens
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTasks();

        setTasks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Create task
  const handleAddTask = async (taskData) => {
    try {
      setError("");

      const newTask = await createTask(taskData);

      setTasks((currentTasks) => [...currentTasks, newTask]);

      setShowTaskForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      setError("");

      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Start editing
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Update task
  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      setError("");

      const updatedTask = await updateTask(taskId, updatedData);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );

      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <p className="text-gray-500 mt-1">
              Welcome back! Here's an overview of your tasks.
            </p>
          </div>

          <Button onClick={() => setShowTaskForm(true)}>+ Add Task</Button>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <TaskForm
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            editingTask={editingTask}
          />
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Tasks</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {tasks.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Completed</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {completedTasks}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">In Progress</p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {inProgressTasks}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Pending</p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingTasks}
            </h2>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Tasks
            </h2>

            <span className="text-sm text-gray-500">{tasks.length} tasks</span>
          </div>

          <div className="divide-y">
            {loading ? (
              <div className="px-6 py-10 text-center text-gray-500">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                No tasks yet. Create your first task!
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  due_date={task.due_date}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
