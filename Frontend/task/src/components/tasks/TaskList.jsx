import React, { useState, useEffect } from "react";
import { taskService } from "../../services/taskService";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import TaskDetails from "./TaskDetails";
import toast from "react-hot-toast";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const loadTasks = async (page = 1) => {
    try {
      setLoading(true);
      const response = await taskService.getTasks(page, 10, filters);
      setTasks(response.tasks);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success("Task created successfully");
      setShowForm(false);
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      toast.success("Task updated successfully");
      setSelectedTask(null);
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.deleteTask(id);
      toast.success("Task deleted successfully");
      loadTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await taskService.updateStatus(id, status);
      toast.success("Task status updated");
      loadTasks();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityUpdate = async (id, priority) => {
    try {
      await taskService.updatePriority(id, priority);
      toast.success("Task priority updated");
      loadTasks();
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">All Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          + Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={() => setSelectedTask(task)}
            onDelete={() => handleDeleteTask(task._id)}
            onStatusUpdate={(status) => handleStatusUpdate(task._id, status)}
            onPriorityUpdate={(priority) =>
              handlePriorityUpdate(task._id, priority)
            }
            onView={() => setSelectedTask(task)}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No tasks found. Create your first task!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => loadTasks(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => loadTasks(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <TaskForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateTask}
        />
      )}

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onStatusUpdate={handleStatusUpdate}
          onPriorityUpdate={handlePriorityUpdate}
        />
      )}
    </div>
  );
};

export default TaskList;
