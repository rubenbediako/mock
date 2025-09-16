import { NextResponse } from 'next/server';
import { getAllExams } from '@/lib/examStorage';

export async function GET() {
  try {
    const exams = getAllExams();
    
    // Return basic exam info for students (without correct answers)
    const studentExams = exams.map(exam => ({
      id: exam.id,
      title: exam.title,
      subject: exam.subject,
      totalMarks: exam.totalMarks,
      duration: exam.duration,
      questionCount: exam.questions.length,
      createdAt: exam.createdAt
    }));

    return NextResponse.json(studentExams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}
