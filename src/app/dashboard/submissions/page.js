'use client';

import { useEffect, useState, useMemo } from 'react';
import React from 'react';
import Modal from '@/app/components/Modal';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [submissionsRes, projectsRes] = await Promise.all([
          fetch('/api/submissions'),
          fetch('/api/projects'),
        ]);

        const submissionsData = await submissionsRes.json();
        const projectsData = await projectsRes.json();

        if (submissionsRes.ok) {
          setSubmissions(submissionsData.submissions || []);
        }
        if (projectsRes.ok) {
          setProjects(projectsData.projects || []);
        }
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const confirmDelete = (id, e) => {
    e.stopPropagation();
    setSubmissionToDelete(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!submissionToDelete) return;

    try {
      const res = await fetch(`/api/submissions/${submissionToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s._id !== submissionToDelete));
      } else {
        alert('Failed to delete submission.');
      }
    } catch (error) {
      alert('Error deleting submission.');
    } finally {
      setSubmissionToDelete(null);
    }
  };

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Group submissions by project for stats
  const projectStats = useMemo(() => {
    const stats = submissions.reduce((acc, sub) => {
      acc[sub.projectId] = (acc[sub.projectId] || 0) + 1;
      return acc;
    }, {});
    return stats;
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    if (selectedProjectId === 'all') return submissions;
    return submissions.filter(s => s.projectId === selectedProjectId);
  }, [submissions, selectedProjectId]);

  const selectedProjectName = useMemo(() => {
    if (selectedProjectId === 'all') return 'All Submissions';
    return projects.find(p => p._id === selectedProjectId)?.name || 'Unknown Project';
  }, [selectedProjectId, projects]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">
          Submissions
        </h1>
        <p className="text-slate-400">
          View and manage all forms submitted through your API.
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <span>Loading submissions...</span>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-[#0b1120] border border-white/5 rounded-3xl">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No submissions yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto">
            Your form submissions will automatically appear here once your API is connected.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Left Side: Project Navigation */}
          <div className="w-full lg:w-64 shrink-0 space-y-2">
            <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Projects</h3>
            <button
              onClick={() => setSelectedProjectId('all')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                selectedProjectId === 'all'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="font-medium">All Projects</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${selectedProjectId === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'}`}>
                {submissions.length}
              </span>
            </button>
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => setSelectedProjectId(project._id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  selectedProjectId === project._id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="font-medium truncate mr-2">{project.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedProjectId === project._id ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'}`}>
                  {projectStats[project._id] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Right Side: Message List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between bg-[#0b1120] border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h2 className="text-lg font-bold text-white">{selectedProjectName}</h2>
              </div>
              <span className="text-sm text-slate-500">{filteredSubmissions.length} messages found</span>
            </div>

            <div className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5">
                  <thead className="bg-[#040814]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sender</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSubmissions.map((sub) => (
                      <React.Fragment key={sub._id}>
                        <tr
                          onClick={() => toggleExpand(sub._id)}
                          className={`group hover:bg-white/5 cursor-pointer transition-all ${expandedId === sub._id ? 'bg-white/5' : ''}`}
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-white">
                            {sub.name || 'Anonymous'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400">
                            {sub.email}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={(e) => confirmDelete(sub._id, e)}
                              className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                        {expandedId === sub._id && (
                          <tr className="bg-black/40 animate-in slide-in-from-top-2 duration-300">
                            <td colSpan="4" className="px-8 py-8">
                              <div className="flex flex-col space-y-4">
                                <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-widest">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                  <span>Message Content</span>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                                </div>

                                {sub.extraData && Object.keys(sub.extraData).length > 0 && (
                                  <>
                                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                      </svg>
                                      <span>Additional Fields</span>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                        {Object.entries(sub.extraData).map(([key, value]) => (
                                          <div key={key} className="flex flex-col">
                                            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{key}</dt>
                                            <dd className="mt-1 text-sm text-slate-300 break-words">{String(value)}</dd>
                                          </div>
                                        ))}
                                      </dl>
                                    </div>
                                  </>
                                )}

                                <div className="flex justify-end mt-4">
                                  <a 
                                    href={`mailto:${sub.email}`}
                                    className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all"
                                  >
                                    Reply via Email
                                  </a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Submission?"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
