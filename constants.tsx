
import { Student, HealthMetric, VisitRecord } from './types';

// Mock data removed as per user request to start with a clean database
export const MOCK_STUDENTS: Student[] = [];

export const MOCK_METRICS: HealthMetric[] = [
  { date: '2023-01', height: 165, weight: 55, bmi: 20.2 },
  { date: '2023-04', height: 166, weight: 56, bmi: 20.3 },
  { date: '2023-07', height: 167, weight: 58, bmi: 20.8 },
  { date: '2023-10', height: 168, weight: 60, bmi: 21.3 },
  { date: '2024-01', height: 169, weight: 62, bmi: 21.7 },
];

export const MOCK_VISITS: VisitRecord[] = [];
