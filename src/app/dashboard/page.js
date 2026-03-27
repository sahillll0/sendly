'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const StatCard = ({ title, value, icon, loading }) => (
  <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 shadow-sm flex items-center space-x-6">
    <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
      <div className="text-3xl font-semibold text-white">
        {loading ? '...' : value}
      </div>
    </div>
  </div>
);

export default function DashboardOverview() {
  const [stats, setStats] = useState({ submissions: [], projects: [] });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    const fetchData = async () => {
      try {
        const [submissionsRes, projectsRes] = await Promise.all([
          fetch('/api/submissions'),
          fetch('/api/projects'),
        ]);

        const submissionsData = await submissionsRes.json();
        const projectsData = await projectsRes.json();

        if (submissionsRes.ok && projectsRes.ok) {
          setStats({
            submissions: submissionsData.submissions || [],
            projects: projectsData.projects || [],
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
        Welcome back, {userName}
      </h1>
      <p className="text-slate-400 mb-10">
        Here is an overview of your account.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Submissions"
          value={stats.submissions.length}
          loading={loading}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          }
        />
        <StatCard
          title="Total Projects"
          value={stats.projects.length}
          loading={loading}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
          }
        />
        <StatCard
          title="Account Status"
          value={'Active'}
          loading={loading}
          icon={
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          }
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Recent Submissions
        </h2>
        <div className="bg-[#0b1120] border border-white/5 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading submissions...
            </div>
          ) : stats.submissions.length === 0 ? (
            <div className="p-8 text-center bg-black/20">
              <h3 className="text-sm font-medium text-white">
                No submissions yet
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                When someone submits your form, it will appear here.
              </p>
              <Link
                href="/dashboard/api-key"
                className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover"
              >
                Create a project to get started
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-[#040814]">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                    >
                      Project
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.submissions.slice(0, 5).map(sub => {
                    const projectName =
                      stats.projects.find(p => p._id === sub.projectId)?.name ||
                      'N/A';
                    return (
                      <tr
                        key={sub._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {sub.name || 'Anonymous'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {sub.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {projectName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {stats.submissions.length > 5 && (
                <div className="p-4 text-center bg-[#040814]">
                  <Link
                    href="/dashboard/submissions"
                    className="text-sm font-medium text-primary hover:text-primary-hover"
                  >
                    View all submissions
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
