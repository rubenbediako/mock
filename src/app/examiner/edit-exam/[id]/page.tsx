"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface SubQuestion {
  id: string;
  text: string;
  marks: number;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'essay';
  options?: string[];
  correctAnswer?: string;
  marks: number;
  section?: string;
  subQuestions?: SubQuestion[];
}

interface SavedExam {
  id: string;
  title: string;
  subject: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  questions: Question[];
  totalMarks: number;
  duration?: number;
}

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<SavedExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (examId) {
      fetchExam();
    }
  }, [examId]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/examiner/exams/${examId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exam');
      }
      
      const data = await response.json();
      setExam(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateExamField = (field: keyof SavedExam, value: any) => {
    if (!exam) return;
    setExam({ ...exam, [field]: value });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    if (!exam) return;
    
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    
    const totalMarks = updatedQuestions.reduce((sum, q) => sum + q.marks, 0);
    setExam({ ...exam, questions: updatedQuestions, totalMarks });
  };

  const deleteQuestion = (index: number) => {
    if (!exam || !confirm('Are you sure you want to delete this question?')) return;
    
    const updatedQuestions = exam.questions.filter((_, i) => i !== index);
    const totalMarks = updatedQuestions.reduce((sum, q) => sum + q.marks, 0);
    setExam({ ...exam, questions: updatedQuestions, totalMarks });
  };

  const addSubQuestion = (qIndex: number) => {
    if (!exam) return;
    const updatedQuestions = [...exam.questions];
    const subQuestions = updatedQuestions[qIndex].subQuestions || [];
    subQuestions.push({
      id: `subq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: '',
      marks: 1
    });
    updatedQuestions[qIndex].subQuestions = subQuestions;
    setExam({ ...exam, questions: updatedQuestions });
  };

  const updateSubQuestion = (qIndex: number, subIndex: number, field: keyof SubQuestion, value: any) => {
    if (!exam) return;
    const updatedQuestions = [...exam.questions];
    const subQuestions = updatedQuestions[qIndex].subQuestions || [];
    subQuestions[subIndex] = { ...subQuestions[subIndex], [field]: value };
    updatedQuestions[qIndex].subQuestions = subQuestions;
    setExam({ ...exam, questions: updatedQuestions });
  };

  const deleteSubQuestion = (qIndex: number, subIndex: number) => {
    if (!exam) return;
    const updatedQuestions = [...exam.questions];
    const subQuestions = updatedQuestions[qIndex].subQuestions || [];
    updatedQuestions[qIndex].subQuestions = subQuestions.filter((_, i) => i !== subIndex);
    setExam({ ...exam, questions: updatedQuestions });
  };

  const saveExam = async () => {
    if (!exam) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/save-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...exam,
          sections: [{
            title: 'Main Section',
            questions: exam.questions
          }]
        }),
      });

      if (response.ok) {
        alert('Exam updated successfully!');
        router.push('/examiner/saved-exams');
      } else {
        alert('Failed to update exam');
      }
    } catch (err) {
      alert('Error updating exam');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error || 'Exam not found'}</div>
          <button
            onClick={() => router.push('/examiner/saved-exams')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Saved Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Exam</h1>
            <button
              onClick={() => router.push('/examiner/saved-exams')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Saved Exams
            </button>
          </div>

          {/* Exam Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Title
              </label>
              <input
                type="text"
                value={exam.title}
                onChange={(e) => updateExamField('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={exam.subject}
                onChange={(e) => updateExamField('subject', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={exam.duration || 120}
                onChange={(e) => updateExamField('duration', parseInt(e.target.value) || 120)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <p>Total Questions: {exam.questions.length}</p>
                <p>Total Marks: {exam.totalMarks}</p>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions</h2>
            
            {exam.questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questions found. The exam may have been created with a different structure.
              </div>
            ) : (
              <div className="space-y-4">
                {exam.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Question {index + 1}
                      </h3>
                      <button
                        onClick={() => deleteQuestion(index)}
                        className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text
                      </label>
                      <textarea
                        value={question.text}
                        onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="essay">Essay</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marks
                        </label>
                        <input
                          type="number"
                          value={question.marks}
                          onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value) || 1)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </div>
                    </div>

                    {question.type === 'multiple-choice' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Options (current correct answer: {question.correctAnswer})
                        </label>
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [])];
                                  newOptions[optIndex] = e.target.value;
                                  updateQuestion(index, 'options', newOptions);
                                }}
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`correct-${index}`}
                                  checked={question.correctAnswer === option}
                                  onChange={() => updateQuestion(index, 'correctAnswer', option)}
                                  className="mr-1"
                                />
                                <span className="text-sm">Correct</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sub-Questions */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub-Questions
                      </label>
                      {question.subQuestions && question.subQuestions.length > 0 && (
                        <div className="space-y-2 mb-2">
                          {question.subQuestions.map((sub, subIndex) => (
                            <div key={sub.id} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={sub.text}
                                onChange={e => updateSubQuestion(index, subIndex, 'text', e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                placeholder={`Sub-question ${subIndex + 1}`}
                              />
                              <input
                                type="number"
                                value={sub.marks}
                                onChange={e => updateSubQuestion(index, subIndex, 'marks', parseInt(e.target.value) || 1)}
                                className="w-20 p-2 border border-gray-300 rounded-md"
                                min="1"
                                placeholder="Marks"
                              />
                              <button
                                type="button"
                                onClick={() => deleteSubQuestion(index, subIndex)}
                                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => addSubQuestion(index)}
                        className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                      >
                        Add Sub-Question
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 mt-2">
                      Total Marks for this question: {question.marks + (question.subQuestions?.reduce((sum, sq) => sum + sq.marks, 0) || 0)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.push('/examiner/saved-exams')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={saveExam}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
