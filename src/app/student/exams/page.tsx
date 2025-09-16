"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AvailableExam {
  id: string;
  title: string;
  subject: string;
  totalMarks: number;
  duration: number;
  questionCount: number;
  createdAt: string;
}

export default function StudentExamsPage() {
  const [exams, setExams] = useState<AvailableExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/exams');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }
      
      const data = await response.json();
      setExams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading available exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button
            onClick={fetchExams}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Exams
          </h1>
          <p className="text-xl text-gray-600">
            Choose an exam to take
          </p>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl">No exams available at the moment</div>
            <p className="text-gray-400 mt-2">Please check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-2">
                    Subject: {exam.subject}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span>{exam.questionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Marks:</span>
                      <span>{exam.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/student/write-exam/${exam.id}`}
                    className="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Start Exam
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
