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

export default function CreateManualExamPage() {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([]);

  const addSection = () => {
    setSections([...sections, { id: Date.now().toString(), title: '', questions: [] }]);
  };

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, title: newTitle } : section
    ));
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'multiple-choice',
      options: [],
      correctAnswer: '',
      marks: 0,
    };
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, questions: [...section.questions, newQuestion] } : section
    ));
  };

  const handleQuestionChange = (sectionId: string, questionId: string, updatedQuestion: Partial<Question>) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            questions: section.questions.map(q =>
              q.id === questionId ? { ...q, ...updatedQuestion } : q
            ),
          }
        : section
    ));
  };
  
  const addOption = (sectionId: string, questionId: string) => {
    const newOption = { id: Date.now().toString(), text: '' };
    setSections(sections.map(section =>
        section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map(q =>
                    q.id === questionId ? { ...q, options: [...q.options, newOption] } : q
                ),
            }
            : section
    ));
  };

  const handleOptionChange = (sectionId: string, questionId: string, optionId: string, newText: string) => {
    setSections(sections.map(section =>
        section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map(q =>
                    q.id === questionId
                        ? {
                            ...q,
                            options: q.options.map(opt =>
                                opt.id === optionId ? { ...opt, text: newText } : opt
                            ),
                        }
                        : q
                ),
            }
            : section
    ));
  };

  const setCorrectAnswer = (sectionId: string, questionId: string, optionId: string) => {
    handleQuestionChange(sectionId, questionId, { correctAnswer: optionId });
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Manual Exam</h1>
        
        <div className="mb-6">
          <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
          <input
            type="text"
            id="examTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., Mid-term Physics"
          />
        </div>

        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                className="text-xl font-semibold text-gray-800 p-2 border border-gray-300 rounded-md w-full"
                placeholder={`Section ${sectionIndex + 1} Title`}
              />
            </div>
            
            {section.questions.map((question, questionIndex) => (
              <div key={question.id} className="mb-6 p-4 border-t">
                <p className="font-semibold mb-2">{`Question ${questionIndex + 1}`}</p>
                <textarea
                  value={question.text}
                  onChange={(e) => handleQuestionChange(section.id, question.id, { text: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Enter question text"
                />
                <div className="flex items-center gap-4 mb-4">
                  <select
                    value={question.type}
                    onChange={(e) => handleQuestionChange(section.id, question.id, { type: e.target.value as 'multiple-choice' | 'essay', options: [], correctAnswer: '' })}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="essay">Essay</option>
                  </select>
                  <input
                    type="number"
                    value={question.marks}
                    onChange={(e) => handleQuestionChange(section.id, question.id, { marks: parseInt(e.target.value) || 0 })}
                    className="p-2 border border-gray-300 rounded-md w-24"
                    placeholder="Marks"
                  />
                </div>

                {question.type === 'multiple-choice' && (
                  <div>
                    {question.options.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name={`correct-answer-${question.id}`}
                          checked={question.correctAnswer === option.id}
                          onChange={() => setCorrectAnswer(section.id, question.id, option.id)}
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(section.id, question.id, option.id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </div>
                    ))}
                    <button onClick={() => addOption(section.id, question.id)} className="text-sm text-blue-600 hover:text-blue-800">
                      + Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => addQuestion(section.id)} className="mt-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md">
              + Add Question
            </button>
          </div>
        ))}

        <button onClick={addSection} className="text-lg font-medium text-white bg-gray-800 hover:bg-gray-900 py-2 px-6 rounded-md">
          + Add Section
        </button>

        <div className="mt-8 text-right">
          <button className="text-lg font-medium text-white bg-green-600 hover:bg-green-700 py-2 px-6 rounded-md">
            Save Exam
          </button>
        </div>
      </div>
    </div>
  );
}
