"use client";

import React, { useState } from 'react';

// Define types for our exam structure
interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'essay';
  options: Option[];
  correctAnswer: string; // For MCQs, this will be the option id
  marks: number;
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface Exam {
    title: string;
    sections: Section[];
}

const jhsNaccaSubjects = [
    "English Language",
    "Mathematics",
    "Integrated Science",
    "Social Studies",
    "Religious and Moral Education (R.M.E)",
    "Ghanaian Language (Asante Twi, Fante, Ga, Ewe)",
    "Basic Design and Technology (BDT)",
    "Computing",
    "French",
    "Career Technology",
    "Creative Arts and Design",
];

export default function CreateAiExamPage() {
  const [subject, setSubject] = useState(jhsNaccaSubjects[0]);
  const [examTitle, setExamTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [questionTypes, setQuestionTypes] = useState({
    'multiple-choice': true,
    essay: false,
  });
  const [instructions, setInstructions] = useState('');
  const [generatedExam, setGeneratedExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'multiple-choice' as 'multiple-choice' | 'essay',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1,
    section: ''
  });

  const handleGenerateExam = async () => {
    setIsLoading(true);
    setGeneratedExam(null);
    try {
      const response = await fetch('/api/create-ai-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          examTitle,
          numQuestions,
          questionTypes,
          instructions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`AI exam generation failed: ${errorData.details || errorData.error || 'Unknown error'}`);
      }

      const exam = await response.json();
      setGeneratedExam(exam);
    } catch (error: any) {
      console.error('Failed to run AI exam generation:', error);
      alert(`Error: ${error.message}`); // Show the detailed error to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExam = async () => {
    if (!generatedExam) return;

    setIsSaving(true);
    setSaveStatus(null);
    try {
      const response = await fetch('/api/save-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatedExam),
      });

      if (!response.ok) {
        throw new Error('Failed to save exam');
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error('Failed to save exam:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000); // Hide message after 3 seconds
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = () => {
    if (!generatedExam) return;

    const questionToAdd: Question = {
      id: `q-${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type,
      options: newQuestion.options.map((opt, index) => ({ id: `opt-${index}`, text: opt })).filter(opt => opt.text),
      correctAnswer: newQuestion.correctAnswer,
      marks: newQuestion.marks,
    };

    const sectionTitle = newQuestion.section || (newQuestion.type === 'multiple-choice' ? 'Section A: Multiple Choice' : 'Section B: Essay');
    
    const updatedExam = { ...generatedExam };
    let section = updatedExam.sections.find(s => s.title === sectionTitle);

    if (section) {
      section.questions.push(questionToAdd);
    } else {
      updatedExam.sections.push({
        id: `sec-${Date.now()}`,
        title: sectionTitle,
        questions: [questionToAdd],
      });
    }

    setGeneratedExam(updatedExam);
    setIsAddingQuestion(false);
    setNewQuestion({
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1,
      section: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Exam with AI</h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Exam Title
            </label>
            <input
              type="text"
              id="examTitle"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Mid-term Assessment"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject (JHS NACCA Curriculum)
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {jhsNaccaSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value === '' ? 0 : parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Question Types</p>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={questionTypes['multiple-choice']}
                  onChange={() => setQuestionTypes(prev => ({ ...prev, 'multiple-choice': !prev['multiple-choice'] }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Multiple Choice</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={questionTypes.essay}
                  onChange={() => setQuestionTypes(prev => ({ ...prev, essay: !prev.essay }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Essay</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Instructions
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Focus on the latest syllabus changes."
              rows={3}
            />
          </div>

          <button
            onClick={handleGenerateExam}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading || !subject || !examTitle}
          >
            {isLoading ? 'Generating Exam...' : 'Generate Exam'}
          </button>
        </div>

        {generatedExam && (
          <div className="mt-8 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{generatedExam.title}</h2>
            {generatedExam.sections.map(section => (
              <div key={section.id} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h3>
                {section.questions.map((q, index) => (
                  <div key={q.id} className="mb-4 p-4 border rounded-md">
                    <p className="font-semibold">{`Q${index + 1}: ${q.text}`}</p>
                    <p className="text-sm text-gray-500">Marks: {q.marks}</p>
                    {q.type === 'multiple-choice' && (
                      <div className="mt-2 space-y-1">
                        {q.options.map(opt => (
                          <p key={opt.id} className={`text-sm ${q.correctAnswer === opt.id ? 'text-green-600 font-semibold' : ''}`}>
                            {opt.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {isAddingQuestion && (
              <div className="mt-6 p-4 border rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Add New Question</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Question Text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="essay">Essay</option>
                  </select>
                  {newQuestion.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      {newQuestion.options.map((opt, index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[index] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: newOptions });
                          }}
                          className="w-full p-2 border rounded-md"
                        />
                      ))}
                      <input
                        type="text"
                        placeholder="Correct Answer (e.g., Option 1)"
                        value={newQuestion.correctAnswer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  )}
                  <input
                    type="number"
                    placeholder="Marks"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                  />
                   <input
                    type="text"
                    placeholder="Section Title (optional)"
                    value={newQuestion.section}
                    onChange={(e) => setNewQuestion({ ...newQuestion, section: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mt-4 flex gap-4">
                  <button onClick={handleAddQuestion} className="bg-blue-600 text-white py-2 px-4 rounded-md">Add Question</button>
                  <button onClick={() => setIsAddingQuestion(false)} className="bg-gray-300 py-2 px-4 rounded-md">Cancel</button>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
                <button 
                    onClick={() => setIsAddingQuestion(true)}
                    className="text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded-md"
                >
                    Add Question
                </button>
                <div className="text-right">
                    <button 
                        onClick={handleSaveExam}
                        className="text-lg font-medium text-white bg-green-600 hover:bg-green-700 py-2 px-6 rounded-md disabled:bg-green-300"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Exam'}
                    </button>
                    {saveStatus === 'success' && (
                        <p className="text-green-600 mt-2">Exam saved successfully!</p>
                    )}
                    {saveStatus === 'error' && (
                        <p className="text-red-600 mt-2">Failed to save exam. Please try again.</p>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
