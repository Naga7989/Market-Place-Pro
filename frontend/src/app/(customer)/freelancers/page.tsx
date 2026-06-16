'use client';

import { Suspense, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Star, DollarSign, Briefcase, Award, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Freelancer {
  id: number;
  bio: string;
  hourlyRate: number;
  rating: number;
  totalProjects: number;
  totalEarnings: number;
  skillsJson?: string; // stored as JSON string or parsed array
  user?: { fullName: string; avatarUrl?: string };
}

interface Project {
  id: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  projectType: string; // FIXED or HOURLY
  skillsRequired?: string; // JSON
  client?: { fullName: string };
}

// Fallback mock data
const mockFreelancers: Freelancer[] = [
  {
    id: 301,
    bio: 'Full-stack React & Node.js Developer. Over 5 years of experience building scalable SaaS web applications with sleek UIs.',
    hourlyRate: 1500,
    rating: 4.9,
    totalProjects: 45,
    totalEarnings: 350000,
    skillsJson: '["React", "Node.js", "Next.js", "Express", "MongoDB", "Tailwind CSS"]',
    user: { fullName: 'Amit Sharma' },
  },
  {
    id: 302,
    bio: 'UI/UX Designer specializing in mobile apps and clean Web3 dashboards. Proficient in Figma, wireframing, and interactive design.',
    hourlyRate: 1200,
    rating: 4.8,
    totalProjects: 32,
    totalEarnings: 220000,
    skillsJson: '["Figma", "UI Design", "UX Research", "Wireframing", "Web Design"]',
    user: { fullName: 'Priya Patel' },
  },
  {
    id: 303,
    bio: 'Java Spring Boot and Python Backend Architect. Expert in microservices, secure REST APIs, and database performance tuning.',
    hourlyRate: 1800,
    rating: 5.0,
    totalProjects: 28,
    totalEarnings: 410000,
    skillsJson: '["Spring Boot", "Java 21", "Python", "MySQL", "AWS", "Docker"]',
    user: { fullName: 'Rohan Deshmukh' },
  },
];

const mockProjects: Project[] = [
  {
    id: 401,
    title: 'E-commerce Android & iOS App in React Native',
    description: 'Looking for an experienced React Native developer to build a complete retail shopping app with Razorpay integration and push notifications.',
    budgetMin: 40000,
    budgetMax: 70000,
    projectType: 'FIXED',
    skillsRequired: '["React Native", "Tailwind CSS", "Razorpay", "Node.js"]',
    client: { fullName: 'TechGro Retailers' },
  },
  {
    id: 402,
    title: 'Figma to Next.js Tailwind Frontend Conversion',
    description: 'Need a frontend developer to convert 12 Figma design screens into pixel-perfect, fully responsive Next.js 15 pages with smooth animations.',
    budgetMin: 15000,
    budgetMax: 25000,
    projectType: 'FIXED',
    skillsRequired: '["Next.js", "Figma", "Tailwind CSS", "Framer Motion"]',
    client: { fullName: 'Aura Agency' },
  },
];

function FreelancersContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [viewTab, setViewTab] = useState<'freelancers' | 'projects'>('freelancers');
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Sync searchQuery when URL query param changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Fetch freelancers
  const { data: freelancersData, isLoading: loadingFreelancers } = useQuery({
    queryKey: ['freelancers'],
    queryFn: async () => {
      const res = await apiClient.get('/freelancers');
      return res.data?.data?.content as Freelancer[];
    },
  });

  // Fetch projects
  const { data: projectsData, isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data?.data?.content as Project[];
    },
  });

  const dbFreelancers = freelancersData || [];
  const freelancers = dbFreelancers.length > 0 ? dbFreelancers : mockFreelancers;

  const dbProjects = projectsData || [];
  const projects = dbProjects.length > 0 ? dbProjects : mockProjects;

  const filteredFreelancers = freelancers.filter((fl) =>
    fl.user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fl.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (fl.skillsJson && fl.skillsJson.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter((pj) =>
    pj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pj.skillsRequired && pj.skillsRequired.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-750 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden shadow-lg shadow-purple-500/25">
          <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none flex items-center justify-center">
            <span className="text-[250px] select-none">💻</span>
          </div>
          <div className="relative z-10 max-w-xl">
            <span className="bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              Gig Economy
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 font-display leading-tight">
              Hire top Indian freelancers for your project.
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-8">
              Explore professional developers, designers, writers, and digital marketers to scale your business.
            </p>

            {/* Search Bar */}
            <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-xl">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder={viewTab === 'freelancers' ? "Search by name, skills (React, Figma, Java)..." : "Search projects, tasks..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => { setViewTab('freelancers'); setSearchQuery(''); }}
            className={`pb-4 px-6 text-sm font-bold transition-all relative ${
              viewTab === 'freelancers' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Find Freelancers
            {viewTab === 'freelancers' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
          </button>
          <button
            onClick={() => { setViewTab('projects'); setSearchQuery(''); }}
            className={`pb-4 px-6 text-sm font-bold transition-all relative ${
              viewTab === 'projects' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Browse Projects
            {viewTab === 'projects' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
          </button>
        </div>

        {/* Content Section */}
        {viewTab === 'freelancers' ? (
          loadingFreelancers ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-32 bg-white dark:bg-gray-800 rounded-2xl"></div>
            </div>
          ) : filteredFreelancers.length === 0 ? (
            <div className="text-center py-12">No freelancers match your search</div>
          ) : (
            <div className="grid gap-6">
              {filteredFreelancers.map((fl) => {
                const skills: string[] = fl.skillsJson ? JSON.parse(fl.skillsJson) : [];
                return (
                  <motion.div
                    key={fl.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 text-base font-bold">
                          {fl.user?.fullName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-base">
                            <Link href={`/freelancers/${fl.id}`} className="hover:text-purple-600">
                              {fl.user?.fullName}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3.5 h-3.5 fill-current text-yellow-400" /> {fl.rating.toFixed(1)}
                            </span>
                            <span>• {fl.totalProjects} Projects</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-350 line-clamp-2 leading-relaxed">
                        {fl.bio}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-150 dark:border-gray-700 flex-shrink-0 gap-4">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-400 font-medium">Hourly Rate</p>
                        <p className="text-lg font-extrabold text-purple-600">{formatPrice(fl.hourlyRate)}/hr</p>
                      </div>
                      <Link
                        href={`/freelancers/${fl.id}`}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-750 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1"
                      >
                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        ) : (
          loadingProjects ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-32 bg-white dark:bg-gray-800 rounded-2xl"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">No open projects found</div>
          ) : (
            <div className="grid gap-6">
              {filteredProjects.map((pj) => {
                const skills: string[] = pj.skillsRequired ? JSON.parse(pj.skillsRequired) : [];
                return (
                  <motion.div
                    key={pj.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-600">
                          {pj.projectType}
                        </span>
                        <span className="text-xs text-gray-400">Posted by {pj.client?.fullName}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base hover:text-purple-600 transition-colors">
                        {pj.title}
                      </h3>
                      <p className="text-sm text-gray-650 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {pj.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-150 dark:border-gray-700 flex-shrink-0 gap-4">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-400 font-medium">Budget</p>
                        <p className="text-lg font-extrabold text-purple-600">
                          {formatPrice(pj.budgetMin)} - {formatPrice(pj.budgetMax)}
                        </p>
                      </div>
                      <button
                        onClick={() => toast.success('Proposal submitted (Mock Mode)!')}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-750 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1"
                      >
                        Apply Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function FreelancersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 animate-pulse">Loading Freelancers...</span>
      </div>
    }>
      <FreelancersContent />
    </Suspense>
  );
}
