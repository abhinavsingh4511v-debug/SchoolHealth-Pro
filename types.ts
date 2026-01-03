
export interface User {
  username: string;
  name: string;
  role: string;
  lastLogin: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  dob: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  lastCheckup: string;
  isImmunized: boolean;
  immunizationDate?: string;
  reviewComments?: string;
  status: 'Healthy' | 'Observation' | 'Action Required';
}

export interface HealthMetric {
  date: string;
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
}

export interface VisitRecord {
  id: string;
  studentId: string;
  date: string;
  time: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  nurseName: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}