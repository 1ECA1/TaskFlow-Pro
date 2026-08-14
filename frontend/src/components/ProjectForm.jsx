import { useEffect, useState } from "react";

import Input from "./Input";
import Button from "./Button";

function ProjectForm({
  onAddProject,
  onUpdateProject,
  onCancel,
  editingProject,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title,
        description: editingProject.description || "",
        status: editingProject.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "active",
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a project title.");
      return;
    }

    if (editingProject) {
      onUpdateProject(editingProject.id, formData);
    } else {
      onAddProject(formData);
    }
  };

  const isEditing = Boolean(editingProject);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? "Edit Project" : "Create New Project"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? "Update the details of your project."
            : "Create a new project for your TaskFlow workspace."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Project Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter project title"
          required
        />

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
            placeholder="Describe the project"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       outline-none transition duration-200
                       focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500
                       placeholder:text-gray-400"
          />
        </div>

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
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit">
            {isEditing ? "Update Project" : "Create Project"}
          </Button>

          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;
