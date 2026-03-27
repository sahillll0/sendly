"use client";

import { useEffect, useState } from "react";
import Modal from "@/app/components/Modal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Modal state
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [projectToDelete, setProjectToDelete] = useState(null);

   // API Key visibility state
   const [visibleKeys, setVisibleKeys] = useState({});

   const toggleKeyVisibility = (id) => {
     setVisibleKeys(prev => ({
       ...prev,
       [id]: !prev[id]
     }));
   };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCopy = (id, apiKey) => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreating(true);
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newProjectName }),
      });
      if (res.ok) {
        setNewProjectName("");
        fetchProjects(); // Refresh the list
      } else {
        alert("Failed to create project.");
      }
    } catch (err) {
      console.error("Creation error", err);
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = (id) => {
    setProjectToDelete(id);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      const res = await fetch(`/api/projects/${projectToDelete}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchProjects();
      } else {
        alert("Failed to delete project.");
      }
    } catch (err) {
      console.error("Deletion error", err);
    } finally {
      setProjectToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Projects & API Keys</h1>
      <p className="text-slate-400 mb-8">
        Manage your projects and their corresponding integration keys. Each project represents a separate website or app integration.
      </p>

      {/* Create Project Form */}
      <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Create New Project</h3>
        <form onSubmit={handleCreateProject} className="flex gap-4">
          <input
            type="text"
            required
            className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder-slate-600"
            placeholder="e.g. Portfolio Website"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors shadow-none disabled:opacity-50 whitespace-nowrap"
          >
            {creating ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-slate-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-slate-500">You haven&apos;t created any projects yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                  <p className="text-xs text-slate-500">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => confirmDelete(project._id)}
                  className="px-3 py-1.5 border border-red-500/20 text-red-500 hover:text-red-400 bg-red-500/10 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Secret API Key</label>
                  <button 
                    onClick={() => toggleKeyVisibility(project._id)}
                    className="text-xs text-primary hover:text-primary-hover font-medium transition-colors"
                  >
                    {visibleKeys[project._id] ? "Hide Key" : "View Key"}
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm truncate text-white">
                    {visibleKeys[project._id] ? project.apiKey : "••••••••••••••••••••••••••••••••"}
                  </div>
                  <button
                    onClick={() => handleCopy(project._id, project.apiKey)}
                    className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors shadow-none"
                  >
                    {copiedId === project._id ? "Copied!" : "Copy Key"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project?"
        message="Are you sure you want to delete this project? Its API key will be permanently invalidated and all forms using it will stop working immediately."
        confirmText="Delete Permanently"
        variant="danger"
      />
    </div>
  );
}
