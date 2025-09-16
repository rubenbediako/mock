import React from 'react';
import Link from 'next/link';

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Portal</h1>
        <p className="text-gray-600 mb-8">
          Welcome to your dashboard. From here, you can access your exams and view your results.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/student/exams"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 text-lg"
          >
            View Available Exams
          </Link>
          <Link
            href="/student/results"
            className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 text-lg"
          >
            View My Results
          </Link>
        </div>
      </div>
    </div>
  );
}
