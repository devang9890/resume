import { Plus, Trash2, ExternalLink } from "lucide-react";
import React from "react";

const ProjectForm = ({ data = [], onChange }) => {
  // ✅ Add new project
  const addProject = () => {
    const newProject = { name: "", type: "", description: "", link: "" };
    onChange([...data, newProject]);
  };

  // ✅ Remove project
  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  // ✅ Update specific project field
  const updateProject = (index, field, value) => {
    const updated = data.map((proj, i) =>
      i === index ? { ...proj, [field]: value } : proj
    );
    onChange(updated);
  };

  // ✅ Helper to check if a link looks valid
  const isValidLink = (url) =>
    url?.startsWith("http://") || url?.startsWith("https://");

  return (
    <div className="p-4 border rounded-2xl shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <button
          onClick={addProject}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No projects added yet. Click “Add Project” to create one.
        </p>
      ) : (
        data.map((project, index) => (
          <div
            key={index}
            className="mb-5 border p-4 rounded-xl bg-gray-50 relative"
          >
            {/* Delete Button */}
            <button
              onClick={() => removeProject(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>

            <h3 className="font-medium text-gray-800 mb-3">
              Project #{index + 1}
            </h3>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  className="w-full border rounded-md px-2 py-1"
                  placeholder="e.g. Smart Farm System"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Type
                </label>
                <input
                  type="text"
                  value={project.type}
                  onChange={(e) => updateProject(index, "type", e.target.value)}
                  className="w-full border rounded-md px-2 py-1"
                  placeholder="e.g. Web App / ML Model"
                />
              </div>

              {/* Project Link */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Project Link (GitHub / Deployed)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) =>
                      updateProject(index, "link", e.target.value)
                    }
                    className="w-full border rounded-md px-2 py-1"
                    placeholder="https://github.com/yourusername/project"
                  />
                  {isValidLink(project.link) && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title="Open Link"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                rows={3}
                className="w-full border rounded-md px-2 py-1 resize-none"
                placeholder="Briefly describe your project, tech stack, and your role..."
              ></textarea>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectForm;
