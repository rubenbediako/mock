import { NextRequest, NextResponse } from 'next/server';
import { getExamById, deleteExam } from '@/lib/examStorage';

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

    // Return full exam data including correct answers for examiner
    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error fetching exam for editing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteExam(id);

    if (success) {
      return NextResponse.json({ message: 'Exam deleted successfully' });
    } else {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json(
      { error: 'Failed to delete exam' },
      { status: 500 }
    );
  }
}
