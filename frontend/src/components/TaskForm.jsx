// import { useEffect, useState } from "react";
// import Input from "./Input";
// import Button from "./Button";

// function TaskForm({ onAddTask, onUpdateTask, onCancel, editingTask }) {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     status: "Pending",
//   });

//   useEffect(() => {
//     if (editingTask) {
//       setFormData({
//         title: editingTask.title,
//         description: editingTask.description,
//         status: editingTask.status,
//       });
//     } else {
//       setFormData({
//         title: "",
//         description: "",
//         status: "Pending",
//       });
//     }
//   }, [editingTask]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.title.trim()) {
//       alert("Please enter a task title.");
//       return;
//     }

//     if (editingTask) {
//       onUpdateTask(editingTask.id, formData);
//     } else {
//       onAddTask(formData);
//     }

//     setFormData({
//       title: "",
//       description: "",
//       status: "Pending",
//     });
//   };

//   const isEditing = Boolean(editingTask);

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           {isEditing ? "Edit Task" : "Create New Task"}
//         </h2>

//         <p className="text-sm text-gray-500 mt-1">
//           {isEditing
//             ? "Update the details of your task."
//             : "Add a new task to your TaskFlow project."}
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <Input
//           label="Task Title"
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           placeholder="Enter task title"
//           required
//         />

//         <div>
//           <label
//             htmlFor="description"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Description
//           </label>

//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Describe the task"
//             rows="4"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg
//                        outline-none transition duration-200
//                        focus:ring-2 focus:ring-blue-500
//                        focus:border-blue-500
//                        placeholder:text-gray-400"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="status"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Status
//           </label>

//           <select
//             id="status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg
//                        outline-none transition duration-200
//                        focus:ring-2 focus:ring-blue-500
//                        focus:border-blue-500"
//           >
//             <option value="Pending">Pending</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Completed">Completed</option>
//           </select>
//         </div>

//         <div className="flex gap-3 pt-2">
//           <Button type="submit">
//             {isEditing ? "Update Task" : "Create Task"}
//           </Button>

//           <Button type="button" variant="secondary" onClick={onCancel}>
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default TaskForm;

import { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";

function TaskForm({ onAddTask, onUpdateTask, onCancel, editingTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    due_date: "",
  });

  // Load task data when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "Pending",
        due_date: editingTask.due_date || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Pending",
        due_date: "",
      });
    }
  }, [editingTask]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    if (editingTask) {
      onUpdateTask(editingTask.id, formData);
    } else {
      onAddTask(formData);
    }

    setFormData({
      title: "",
      description: "",
      status: "Pending",
      due_date: "",
    });
  };

  const isEditing = Boolean(editingTask);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      {/* Form Header */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? "Edit Task" : "Create New Task"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? "Update the details of your task."
            : "Add a new task to your TaskFlow project."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Title */}

        <Input
          label="Task Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />

        {/* Description */}

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       outline-none transition duration-200
                       focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500
                       placeholder:text-gray-400"
          />
        </div>

        {/* Status */}

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       outline-none transition duration-200
                       focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Due Date */}

        <div>
          <label
            htmlFor="due_date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Due Date
          </label>

          <input
            id="due_date"
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       outline-none transition duration-200
                       focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500"
          />
        </div>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit">
            {isEditing ? "Update Task" : "Create Task"}
          </Button>

          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
