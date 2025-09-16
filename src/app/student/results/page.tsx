"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock data for student results
const mockResults = [
  {
    id: 'res1',
    examTitle: 'Monthly Exam - August',
    subject: 'Integrated Science',
    score: 85,
    grade: 'A',
    remarks: 'Excellent performance. Keep up the great work!',
    date: '2025-09-01',
  },
  {
    id: 'res2',
    examTitle: 'Monthly Exam - August',
    subject: 'Mathematics',
    score: 78,
    grade: 'B+',
    remarks: 'Good effort. Focus more on algebra.',
    date: '2025-09-01',
  },
];

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState([]);

  useEffect(() => {
    // In a real app, fetch results from the backend
    setResults(mockResults as any);
  }, []);

  const handleReadReport = (result: any) => {
    const reportText = `
      Your result for ${result.examTitle} in ${result.subject}.
      You scored ${result.score} out of 100, which is a grade of ${result.grade}.
      Remarks: ${result.remarks}
    `;
    const utterance = new SpeechSynthesisUtterance(reportText);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Results</h1>
        <div className="space-y-6">
          {results.length > 0 ? (
            results.map((result: any) => (
              <div key={result.id} className="p-6 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-800">{result.examTitle}</h2>
                    <p className="text-md font-semibold text-gray-700">{result.subject}</p>
                    <p className="text-sm text-gray-500">Completed on: {new Date(result.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-600">{result.score}%</p>
                    <p className="text-xl font-semibold text-green-500">Grade: {result.grade}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600"><strong>Remarks:</strong> {result.remarks}</p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleReadReport(result)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Read Report Aloud
                  </button>
                  <button
                    onClick={() => router.push(`/student/certificate/${result.id}`)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    View Certificate
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No results available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
