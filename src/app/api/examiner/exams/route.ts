import { NextResponse } from 'next/server';
import { getExamsByCreator } from '@/lib/examStorage';

export async function GET() {
  try {
    // In a real app, you'd get the examiner ID from authentication
    const examinerId = 'examiner_1';
    const exams = getExamsByCreator(examinerId);

    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching examiner exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}
