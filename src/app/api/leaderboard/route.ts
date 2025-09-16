import { NextRequest, NextResponse } from 'next/server';
import exams from '@/data/exams.json';

// This is a mock. Replace with real student results storage in production.
export async function GET() {
  // Aggregate student scores from exams.json (or other source)
  // Example: [{ studentName, totalScore, examsTaken }]
  const leaderboard = [];
  const studentScores: Record<string, { name: string; totalScore: number; examsTaken: number }> = {};

  for (const exam of exams) {
    for (const submission of exam.submissions || []) {
      const { studentName, score } = submission;
      if (!studentScores[studentName]) {
        studentScores[studentName] = { name: studentName, totalScore: 0, examsTaken: 0 };
      }
      studentScores[studentName].totalScore += score;
      studentScores[studentName].examsTaken += 1;
    }
  }

  for (const student in studentScores) {
    leaderboard.push({
      name: studentScores[student].name,
      averageScore: Math.round(studentScores[student].totalScore / studentScores[student].examsTaken),
      examsTaken: studentScores[student].examsTaken,
    });
  }

  leaderboard.sort((a, b) => b.averageScore - a.averageScore);

  return NextResponse.json(leaderboard);
}
