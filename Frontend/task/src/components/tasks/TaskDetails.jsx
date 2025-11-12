import React, { useState } from "react";
import TaskForm from "./TaskForm";

const TaskDetails = ({
  task,
  onClose,
  onUpdate,
  onStatusUpdate,
  onPriorityUpdate,
}) => {
  const [editing, setEditing] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    return status === "completed"
      ? "text-green-600 bg-green-100"
      : "text-yellow-600 bg-yellow-100";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  if (editing) {
    return (
      <TaskForm
        task={task}
        onClose={() => setEditing(false)}
        onSubmit={(data) => onUpdate(task._id, data)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
            <div className="flex space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority} Priority
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
            <p
              className={`text-lg ${
                isOverdue ? "text-red-600 font-semibold" : "text-gray-700"
              }`}
            >
              {formatDate(task.dueDate)}
              {isOverdue && " (Overdue)"}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Created
              </h3>
              <p className="text-gray-700">{formatDate(task.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </h3>
              <p className="text-gray-700">{formatDate(task.updatedAt)}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <select
                value={task.status}
                onChange={(e) => onStatusUpdate(task._id, e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Mark as Pending</option>
                <option value="completed">Mark as Completed</option>
              </select>

              <select
                value={task.priority}
                onChange={(e) => onPriorityUpdate(task._id, e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Set to Low Priority</option>
                <option value="medium">Set to Medium Priority</option>
                <option value="high">Set to High Priority</option>
              </select>

              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
