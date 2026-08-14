import { useEffect, useState } from "react";

import Header from "../components/Header";
import Button from "../components/Button";
import ProjectForm from "../components/ProjectForm";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load projects from Django
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProjects();

        setProjects(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Create project
  const handleAddProject = async (projectData) => {
    try {
      setError("");

      const newProject = await createProject(projectData);

      setProjects((currentProjects) => [...currentProjects, newProject]);

      setShowProjectForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Start editing
  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  // Update project
  const handleUpdateProject = async (projectId, updatedData) => {
    try {
      setError("");

      const updatedProject = await updateProject(projectId, updatedData);

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === projectId ? updatedProject : project,
        ),
      );

      setEditingProject(null);
      setShowProjectForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    try {
      setError("");

      await deleteProject(projectId);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId),
      );
    } catch (error) {
      setError(error.message);
    }
  };

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

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Projects</h1>

            <p className="text-gray-500 mt-1">
              Create and manage your TaskFlow projects.
            </p>
          </div>

          <Button onClick={() => setShowProjectForm(true)}>
            + Add Project
          </Button>
        </div>

        {/* Project Form */}
        {showProjectForm && (
          <ProjectForm
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onCancel={() => {
              setShowProjectForm(false);
              setEditingProject(null);
            }}
            editingProject={editingProject}
          />
        )}

        {/* Projects */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Projects
            </h2>

            <span className="text-sm text-gray-500">
              {projects.length} projects
            </span>
          </div>

          <div className="divide-y">
            {loading ? (
              <div className="px-6 py-10 text-center text-gray-500">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                No projects yet. Create your first project!
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {project.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {project.description || "No description"}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {project.status === "active" ? "Active" : "Archived"}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => handleEditProject(project)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Projects;
