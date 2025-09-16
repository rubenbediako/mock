import Link from 'next/link';
import React from 'react';

export default function ExaminerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Examiner Portal
          </h1>
          <p className="text-xl text-gray-600">
            Create, manage, and grade exams with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/examiner/create-ai-exam"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🤖</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Create AI Exam
            </h2>
            <p className="text-gray-600">
              Generate exams automatically using AI based on curriculum topics
            </p>
          </Link>

          <Link
            href="/examiner/create-manual-exam"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Create Manual Exam
            </h2>
            <p className="text-gray-600">
              Build custom exams with your own questions and sections
            </p>
          </Link>

          <Link
            href="/examiner/saved-exams"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Saved Exams
            </h2>
            <p className="text-gray-600">
              View and edit your previously created exams
            </p>
          </Link>

          <Link
            href="/examiner/ai-marking"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🎯</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              AI Marking
            </h2>
            <p className="text-gray-600">
              Grade student submissions with AI assistance and feedback
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
