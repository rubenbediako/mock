"use client";

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// Mock data - in a real app, fetch this based on the result ID
const mockCertificateData = {
  res1: {
    studentName: 'John Doe',
    examTitle: 'Monthly Exam - August',
    subject: 'Integrated Science',
    score: 85,
    grade: 'A',
    date: '2025-09-15',
  },
  res2: {
    studentName: 'John Doe',
    examTitle: 'Monthly Exam - August',
    subject: 'Mathematics',
    score: 78,
    grade: 'B+',
    date: '2025-09-15',
  },
};

export default function CertificatePage({ params }: { params: { id: string } }) {
  const certificateRef = useRef(null);
  const data = mockCertificateData[params.id as keyof typeof mockCertificateData];

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
  });

  if (!data) {
    return <div className="p-8">Certificate not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 p-8 flex flex-col items-center">
      <div ref={certificateRef} className="w-full max-w-4xl bg-white p-12 shadow-lg" style={{ border: '10px solid #4a90e2' }}>
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-800" style={{ fontFamily: "'Cinzel', serif" }}>
            Certificate of Achievement
          </h1>
          <p className="text-lg mt-4 text-gray-600">This certificate is proudly presented to</p>
          <h2 className="text-4xl font-semibold text-gray-900 mt-6" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {data.studentName}
          </h2>
          <p className="text-lg mt-6 text-gray-600">for outstanding performance in the</p>
          <h3 className="text-3xl font-bold text-blue-700 mt-2">{data.examTitle}</h3>
          <p className="text-xl mt-2 text-gray-700">({data.subject})</p>
          <div className="mt-8 inline-block bg-green-100 text-green-800 px-6 py-2 rounded-full">
            <p className="text-lg">Score: <span className="font-bold">{data.score}%</span> | Grade: <span className="font-bold">{data.grade}</span></p>
          </div>
          <div className="flex justify-between items-center mt-16">
            <div>
              <p className="text-sm text-gray-500">_________________________</p>
              <p className="text-sm text-gray-600 font-semibold">Head of School</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date: {data.date}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handlePrint}
        className="mt-8 bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 text-lg"
      >
        Print or Save as PDF
      </button>
    </div>
  );
}
