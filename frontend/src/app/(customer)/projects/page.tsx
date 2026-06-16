'use client';

import { Briefcase, Code, Terminal, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const projects = [
    { id: 1, title: 'Next.js E-Commerce Frontend Development', budget: '₹45,000', type: 'FIXED', status: 'IN_PROGRESS', freelancer: 'Vikram Aditya' },
    { id: 2, title: 'Database Optimization & Clustering', budget: '₹1,500/hr', type: 'HOURLY', status: 'OPEN', freelancer: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-3">
            <Briefcase className="text-violet-600 w-6 h-6" /> Freelance Projects Hub
          </h1>
          <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md">
            Post a Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No projects posted</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Post projects to hire top freelance talent across India.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{proj.title}</h3>
                    <p className="text-xs text-gray-450 mt-1 flex items-center gap-2">
                      <span>Type: <strong className="text-gray-700 dark:text-gray-300">{proj.type}</strong></span>
                      <span>•</span>
                      <span>Budget: <strong className="text-violet-600 dark:text-violet-400">{proj.budget}</strong></span>
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    proj.status === 'IN_PROGRESS'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                      : 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                  }`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <span className="text-gray-400">
                    {proj.freelancer ? (
                      <>Hired Freelancer: <strong className="text-gray-700 dark:text-gray-300">{proj.freelancer}</strong></>
                    ) : (
                      'Awaiting proposals...'
                    )}
                  </span>
                  <button className="text-violet-600 hover:underline font-semibold">
                    Manage Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
