import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { subject, examTitle, numQuestions, questionTypes, instructions } = await req.json();

    // Loosened validation: instructions can be an empty string
    if (!subject || !examTitle || !numQuestions || !questionTypes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const questionTypeString = Object.entries(questionTypes)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(', ');

    const prompt = `
      Generate an exam with the title "${examTitle}" for the subject "${subject}" based on the NACCA curriculum.

      Instructions:
      - Number of questions: ${numQuestions}
      - Question types: ${questionTypeString}
      - Additional instructions from the examiner: "${instructions}"
      - Each question must have a unique ID, the question text, the question type, marks, and for multiple-choice questions, a list of options and the correct answer.

      Return the response as a single JSON object in the following format:
      {
        "title": "${examTitle}",
        "sections": [
          {
            "id": "string",
            "title": "string",
            "questions": [
              {
                "id": "string",
                "text": "string",
                "type": "'multiple-choice' or 'essay'",
                "options": [
                  { "id": "string", "text": "string" }
                ],
                "correctAnswer": "string (option id for multiple-choice)",
                "marks": "number"
              }
            ]
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Switched to a more common and faster model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("OpenAI returned an empty response.");
    }

    const generatedExam = JSON.parse(response.choices[0].message.content);

    return NextResponse.json(generatedExam);
  } catch (error) {
    console.error('Error in AI exam generation:', error);
    const errorMessage = (error as Error).message || 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate exam with AI', details: errorMessage }, { status: 500 });
  }
}
