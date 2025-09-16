import { NextRequest, NextResponse } from 'next/server';
import { saveExam, SavedExam } from '@/lib/examStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Calculate total marks from sections and questions
    let totalMarks = 0;
    const questions = [];
    
    if (body.sections && Array.isArray(body.sections)) {
      for (const section of body.sections) {
        if (section.questions && Array.isArray(section.questions)) {
          for (const question of section.questions) {
            questions.push({
              id: question.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              text: question.text,
              type: question.type,
              options: question.options?.map((opt: any) => opt.text || opt) || [],
              correctAnswer: question.correctAnswer,
              marks: question.marks || 1,
              section: section.title
            });
            totalMarks += question.marks || 1;
          }
        }
      }
    }

    // Create exam object
    const exam: SavedExam = {
      id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: body.title || 'Untitled Exam',
      subject: body.subject || 'General',
      createdBy: 'examiner_1', // In a real app, this would come from user authentication
      createdAt: new Date().toISOString(),
      questions,
      totalMarks,
      duration: 120 // Default 2 hours
    };

    const success = saveExam(exam);

    if (success) {
      return NextResponse.json({ 
        message: 'Exam saved successfully!', 
        examId: exam.id 
      });
    } else {
      return NextResponse.json(
        { message: 'Failed to save exam' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving exam:', error);
    return NextResponse.json(
      { message: 'Failed to save exam' },
      { status: 500 }
    );
  }
}
