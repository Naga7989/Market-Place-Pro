'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Globe, Briefcase, Mail, CheckCircle2, DollarSign } from 'lucide-react';
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
  skillsJson?: string;
  user?: { fullName: string; email: string; avatarUrl?: string };
}

// Fallback freelancer profiles
const mockFreelancers: Record<number, Freelancer> = {
  301: {
    id: 301,
    bio: 'Full-stack React & Node.js Developer. Over 5 years of experience building scalable SaaS web applications with sleek UIs. Specialize in microservice architectures, Next.js optimization, Docker deployments, and Tailwind CSS. Client satisfaction is my top priority.',
    hourlyRate: 1500,
    rating: 4.9,
    totalProjects: 45,
    totalEarnings: 350000,
    skillsJson: '["React", "Node.js", "Next.js", "Express", "MongoDB", "Tailwind CSS", "TypeScript", "Docker", "Git"]',
    user: { fullName: 'Amit Sharma', email: 'amit.sharma@example.com' },
  },
  302: {
    id: 302,
    bio: 'UI/UX Designer specializing in mobile apps and clean Web3 dashboards. Proficient in Figma, wireframing, high-fidelity prototypes, and interactive design. I bridge the gap between complex engineering requirements and intuitive, clean visual design.',
    hourlyRate: 1200,
    rating: 4.8,
    totalProjects: 32,
    totalEarnings: 220000,
    skillsJson: '["Figma", "UI Design", "UX Research", "Wireframing", "Web Design", "Mobile App Design", "Adobe XD"]',
    user: { fullName: 'Priya Patel', email: 'priya.patel@example.com' },
  },
  303: {
    id: 303,
    bio: 'Java Spring Boot and Python Backend Architect. Expert in microservices, secure REST APIs, and database performance tuning. Over 8 years of corporate and freelance backend development experience under secure architectures.',
    hourlyRate: 1800,
    rating: 5.0,
    totalProjects: 28,
    totalEarnings: 410000,
    skillsJson: '["Spring Boot", "Java 21", "Python", "MySQL", "AWS", "Docker", "Redis", "Kafka", "Kubernetes"]',
    user: { fullName: 'Rohan Deshmukh', email: 'rohan.d@example.com' },
  },
};

export default function FreelancerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const freelancerId = params.id;

  // Fetch freelancer
  const { data: freelancerData, isLoading } = useQuery({
    queryKey: ['freelancer', freelancerId],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/freelancers/${freelancerId}`);
        return res.data?.data as Freelancer;
      } catch (err) {
        // Fallback to mock
        const mock = mockFreelancers[Number(freelancerId)];
        if (mock) return mock;
        throw err;
      }
    },
  });

  const freelancer = freelancerData;
  const skills: string[] = freelancer?.skillsJson ? JSON.parse(freelancer.skillsJson) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-950">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Freelancer Profile Not Found</h3>
        <Link href="/freelancers" className="px-6 py-3 bg-purple-600 text-white rounded-xl">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => router.push('/freelancers')}
          className="flex items-center gap-2 text-sm text-gray-650 dark:text-gray-400 hover:text-purple-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Bio & Skills */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 text-2xl font-bold">
                  {freelancer.user?.fullName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{freelancer.user?.fullName}</h1>
                  <p className="text-sm text-gray-400">{freelancer.user?.email}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-base">About Me</h3>
              <p className="text-sm text-gray-650 dark:text-gray-350 leading-relaxed whitespace-pre-wrap">
                {freelancer.bio}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Professional Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-purple-500" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 font-medium mb-1">Hourly Rate</p>
                <p className="text-3xl font-extrabold text-purple-600">{formatPrice(freelancer.hourlyRate)}/hr</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <span className="text-xs text-gray-400 font-semibold block mb-1">Rating</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" /> {freelancer.rating.toFixed(1)}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <span className="text-xs text-gray-400 font-semibold block mb-1">Completed</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center justify-center gap-1">
                    <Briefcase className="w-4 h-4 text-purple-500" /> {freelancer.totalProjects} Jobs
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => toast.success('Hire request submitted (Mock Mode)!')}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 transition-all text-sm"
                >
                  Hire {freelancer.user?.fullName.split(' ')[0]}
                </button>
                <button
                  onClick={() => toast.success('Contact message sent (Mock Mode)!')}
                  className="w-full py-3.5 border border-purple-200 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-purple-600 text-sm font-bold rounded-xl transition-all"
                >
                  Contact Freelancer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
