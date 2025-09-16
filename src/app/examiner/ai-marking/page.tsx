"use client";

import React, { useState } from 'react';

// Mock data for student submissions
const mockSubmissions = [
  {
    id: 'sub1',
    studentName: 'Alice Johnson',
    examTitle: 'Mid-term Physics',
    answers: [
      { questionId: 'q1', answer: 'The powerhouse of the cell is the mitochondria.' },
      { questionId: 'q2', answer: '2 * 2 = 4' },
    ],
    status: 'Pending',
  },
  {
    id: 'sub2',
    studentName: 'Bob Williams',
    examTitle: 'Mid-term Physics',
    answers: [
      { questionId: 'q1', answer: 'Mitochondria are known as the powerhouse of the cell.' },
      { questionId: 'q2', answer: '2 * 2 = 5' },
    ],
    status: 'Pending',
  },
];

// Mock data for marking criteria
const mockCriteria = {
  q1: 'Answer should mention mitochondria as the powerhouse of the cell.',
  q2: 'The correct answer is 4.',
};

export default function AiMarkingPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [markingResults, setMarkingResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportQuestionId, setReportQuestionId] = useState(null);

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
    setMarkingResults({});
  };

  const handleAiMarking = async () => {
    if (!selectedSubmission) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-marking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: selectedSubmission.answers,
          criteria: mockCriteria,
        }),
      });

      if (!response.ok) {
        throw new Error('AI marking failed');
      }

      const results = await response.json();
      setMarkingResults(results);
      setSubmissions(subs => subs.map(s => s.id === selectedSubmission.id ? { ...s, status: 'Marked' } : s));
    } catch (error) {
      console.error('Failed to run AI marking:', error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  function handleReadReport(report: any) {
    const text = `Overall Score: ${report.overall?.score}. Grade: ${report.grade} (${report.gradeLabel}). Feedback: ${report.overall?.feedback}. Criteria breakdown: ${Object.entries(report.criteria || {}).map(([crit, val]) => `${crit.replace('_', ' ')}: Score ${(val as any).score}, ${(val as any).comment}`).join('. ')}.`;
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Marking</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Student Submissions</h2>
            <div className="space-y-2">
              {submissions.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-4 rounded-lg cursor-pointer ${selectedSubmission?.id === sub.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'} border`}
                >
                  <p className="font-semibold">{sub.studentName}</p>
                  <p className="text-sm text-gray-600">{sub.examTitle}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${sub.status === 'Marked' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Marking Area */}
          <div className="md:col-span-2">
            {selectedSubmission ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Marking: {selectedSubmission.studentName}</h2>
                <button
                  onClick={handleAiMarking}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 mb-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'AI is Marking...' : 'Run AI Marking'}
                </button>

                <div className="space-y-6">
                  {selectedSubmission.answers.map((ans, index) => (
                    <div key={ans.questionId} className="p-4 border rounded-lg">
                      <p className="font-semibold mb-2">Question {index + 1}</p>
                      <p className="bg-gray-50 p-3 rounded-md mb-3">{ans.answer}</p>
                      {markingResults[ans.questionId] && (
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="font-semibold text-blue-800">Overall Score: {(markingResults as any)[ans.questionId].overall?.score}</p>
                          <p className="font-semibold text-green-700">Grade: {(markingResults as any)[ans.questionId].grade} ({(markingResults as any)[ans.questionId].gradeLabel})</p>
                          <p className="text-sm text-blue-700">Feedback: {(markingResults as any)[ans.questionId].overall?.feedback}</p>
                          <button
                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => { setReportQuestionId(ans.questionId); setShowReport(true); }}
                          >
                            Show Report
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <p className="text-gray-500">Select a submission to start marking.</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Modal */}
        {showReport && reportQuestionId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
              <h3 className="text-xl font-bold mb-4">Detailed Report</h3>
              {markingResults[reportQuestionId] && (
                <div>
                  <div className="mb-4">
                    <p className="font-semibold">Overall Score: {(markingResults as any)[reportQuestionId].overall?.score}</p>
                    <p className="font-semibold text-green-700">Grade: {(markingResults as any)[reportQuestionId].grade} ({(markingResults as any)[reportQuestionId].gradeLabel})</p>
                    <p className="text-sm">Feedback: {(markingResults as any)[reportQuestionId].overall?.feedback}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Criteria Breakdown:</h4>
                    <ul className="space-y-2">
                      {Object.entries((markingResults as any)[reportQuestionId].criteria || {}).map(([crit, val]) => (
                        <li key={crit} className="border p-2 rounded">
                          <span className="font-bold capitalize">{crit.replace('_', ' ')}:</span> Score: {(val as any).score}, <span className="italic">{(val as any).comment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleReadReport((markingResults as any)[reportQuestionId])}
              >
                AI Read Report
              </button>
              <button
                className="mt-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
                onClick={() => setShowReport(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
