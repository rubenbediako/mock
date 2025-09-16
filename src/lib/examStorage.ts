import fs from 'fs';
import path from 'path';

const EXAMS_FILE = path.join(process.cwd(), 'src/data/exams.json');

export interface SavedExam {
  id: string;
  title: string;
  subject: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  questions: Array<{
    id: string;
    text: string;
    type: 'multiple-choice' | 'essay';
    options?: string[];
    correctAnswer?: string;
    marks: number;
    section?: string;
  }>;
  totalMarks: number;
  duration?: number;
}

// Ensure the data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(EXAMS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize exams file if it doesn't exist
function initializeExamsFile() {
  ensureDataDirectory();
  if (!fs.existsSync(EXAMS_FILE)) {
    fs.writeFileSync(EXAMS_FILE, JSON.stringify([], null, 2));
  }
}

export function saveExam(exam: SavedExam): boolean {
  try {
    initializeExamsFile();
    const exams = getAllExams();
    
    // Check if exam already exists (update) or create new
    const existingIndex = exams.findIndex(e => e.id === exam.id);
    if (existingIndex >= 0) {
      // Preserve original creation date when updating
      const originalCreatedAt = exams[existingIndex].createdAt;
      exams[existingIndex] = {
        ...exam,
        createdAt: originalCreatedAt,
        updatedAt: new Date().toISOString()
      };
    } else {
      exams.push(exam);
    }
    
    fs.writeFileSync(EXAMS_FILE, JSON.stringify(exams, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving exam:', error);
    return false;
  }
}

export function getAllExams(): SavedExam[] {
  try {
    initializeExamsFile();
    const data = fs.readFileSync(EXAMS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading exams:', error);
    return [];
  }
}

export function getExamById(id: string): SavedExam | null {
  const exams = getAllExams();
  return exams.find(exam => exam.id === id) || null;
}

export function getExamsByCreator(creatorId: string): SavedExam[] {
  const exams = getAllExams();
  return exams.filter(exam => exam.createdBy === creatorId);
}

export function deleteExam(id: string): boolean {
  try {
    const exams = getAllExams();
    const filteredExams = exams.filter(exam => exam.id !== id);
    
    if (filteredExams.length === exams.length) {
      return false; // Exam not found
    }
    
    fs.writeFileSync(EXAMS_FILE, JSON.stringify(filteredExams, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting exam:', error);
    return false;
  }
}
