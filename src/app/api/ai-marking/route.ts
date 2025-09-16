import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getCustomGrade(percent: number): { grade: number, label: string } {
  if (percent >= 80) return { grade: 1, label: 'Highest' };
  if (percent >= 75) return { grade: 2, label: 'Higher' };
  if (percent >= 70) return { grade: 3, label: 'High' };
  if (percent >= 65) return { grade: 4, label: 'High average' };
  if (percent >= 60) return { grade: 5, label: 'Average' };
  if (percent >= 55) return { grade: 6, label: 'Low average' };
  if (percent >= 50) return { grade: 7, label: 'Low' };
  if (percent >= 45) return { grade: 8, label: 'Lower' };
  if (percent >= 40) return { grade: 9, label: 'Lowest' };
  return { grade: 9, label: 'Lowest' };
}

export async function POST(req: NextRequest) {
  try {
    const { answers, criteria, totalMarks } = await req.json();

    if (!answers || !criteria || !totalMarks) {
      return NextResponse.json({ error: 'Missing answers, criteria, or totalMarks' }, { status: 400 });
    }

    let totalAwardedMarks = 0;
    const results = {};

    for (const answer of answers) {
      const prompt = `
        You are an expert examiner using the JHS NACCA curriculum. Mark the student's answer based on these criteria:
        - Relevance to question
        - Grammatical correctness
        - Near-answer marking (partial credit)
        - Correct sentences
        - Detail
        - Award marks for excellence

        For each criterion, provide a score (1-10) and a brief comment. Then, give an overall score (1-10) and summary feedback. Return the response in this JSON format:
        {
          "criteria": {
            "relevance": { "score": <number>, "comment": "<string>" },
            "grammar": { "score": <number>, "comment": "<string>" },
            "near_answer": { "score": <number>, "comment": "<string>" },
            "sentences": { "score": <number>, "comment": "<string>" },
            "detail": { "score": <number>, "comment": "<string>" },
            "excellence": { "score": <number>, "comment": "<string>" }
          },
          "overall": {
            "score": <number>,
            "feedback": "<string>"
          }
        }

        Criteria: "${criteria[answer.questionId]}"
        Student's Answer: "${answer.answer}"
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      });

      const content = response.choices[0].message.content ?? '{}';
      const result = JSON.parse(content);
      // Use overall score as awarded marks for this question
      const awardedMarks = Math.round((result.overall?.score ?? 0) / 10 * (answer.marks ?? 0));
      totalAwardedMarks += awardedMarks;
      result.awardedMarks = awardedMarks;
      result.maxMarks = answer.marks ?? 0;
      (results as any)[answer.questionId] = result;
    }

    // Compute percent and grade for the whole exam
    const percent = totalMarks > 0 ? Math.round((totalAwardedMarks / totalMarks) * 100) : 0;
    const gradeObj = getCustomGrade(percent);

    return NextResponse.json({
      results,
      totalAwardedMarks,
      totalMarks,
      percent,
      grade: gradeObj.grade,
      gradeLabel: gradeObj.label,
    });
  } catch (error) {
    console.error('Error in AI marking:', error);
    return NextResponse.json({ error: 'Failed to mark with AI' }, { status: 500 });
  }
}
