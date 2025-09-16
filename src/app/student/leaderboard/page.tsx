"use client";

import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [awarding, setAwarding] = useState(false);
  const [awardedStudent, setAwardedStudent] = useState(null);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(setLeaderboard);
  }, []);

  const handleAward = async (student: any) => {
    setAwarding(true);
    // TODO: Integrate Flutterwave payment here
    // Simulate awarding
    setTimeout(() => {
      setAwardedStudent(student.name);
      setAwarding(false);
      alert(`Award sent to ${student.name} via Flutterwave!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Leaderboard</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Avg. Score</th>
              <th className="p-3 text-left">Exams Taken</th>
              <th className="p-3 text-left">Award</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((student: any, idx: number) => (
              <tr key={student.name} className={idx === 0 ? 'bg-yellow-100 font-bold' : ''}>
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.averageScore}%</td>
                <td className="p-3">{student.examsTaken}</td>
                <td className="p-3">
                  {idx === 0 ? (
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      disabled={awarding || awardedStudent === student.name}
                      onClick={() => handleAward(student)}
                    >
                      {awardedStudent === student.name ? 'Awarded' : awarding ? 'Awarding...' : 'Award Best Student'}
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
