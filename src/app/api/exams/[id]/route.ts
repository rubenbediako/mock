import { NextRequest, NextResponse } from 'next/server';
import { getExamById } from '@/lib/examStorage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exam = getExamById(id);

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Remove correct answers for students
    const studentExam = {
      ...exam,
      questions: exam.questions.map(q => ({
        ...q,
        correctAnswer: undefined // Don't send correct answers to students
      }))
    };

    return NextResponse.json(studentExam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    );
  }
}
