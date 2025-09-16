"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavedExam {
  id: string;
  title: string;
  subject: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  questions: Array<{
    id: string;
    text: string;
    type: 'multiple-choice' | 'essay';
    options?: string[];
    correctAnswer?: string;
    marks: number;
    section?: string;
  }>;
  totalMarks: number;
  duration?: number;
}

export default function SavedExamsPage() {
  const [exams, setExams] = useState<SavedExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/examiner/exams');
      
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

  const handleDeleteExam = async (examId: string, examTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${examTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/examiner/exams/${examId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setExams(exams.filter(exam => exam.id !== examId));
        alert('Exam deleted successfully!');
      } else {
        alert('Failed to delete exam');
      }
    } catch (err) {
      alert('Error deleting exam');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your saved exams...</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Saved Exams
            </h1>
            <p className="text-xl text-gray-600">
              Manage and edit your created exams
            </p>
          </div>
          <Link
            href="/examiner"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">
              No saved exams found.
            </div>
            <p className="text-gray-400 mb-6">Create your first exam to get started.</p>
            <div className="space-x-4">
              <Link
                href="/examiner/create-ai-exam"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create AI Exam
              </Link>
              <Link
                href="/examiner/create-manual-exam"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Create Manual Exam
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {exam.title}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">
                      Subject: {exam.subject}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Questions:</span> {exam.questions.length}
                      </div>
                      <div>
                        <span className="font-medium">Total Marks:</span> {exam.totalMarks}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {exam.duration} minutes
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {new Date(exam.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {exam.updatedAt && (
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(exam.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Link
                      href={`/examiner/edit-exam/${exam.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/examiner/preview-exam/${exam.id}`}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
                    >
                      Preview
                    </Link>
                    <button
                      onClick={() => handleDeleteExam(exam.id, exam.title)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
