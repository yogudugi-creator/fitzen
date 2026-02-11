
export type FitnessGoal = 'weight-loss' | 'muscle-gain' | 'endurance' | 'flexibility' | 'maintenance';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  goal: FitnessGoal;
  level: FitnessLevel;
}

export interface UserStats {
  dailyCaloriesGoal: number;
  consumedCalories: number;
  burnedCalories: number;
  steps: number;
  waterIntake: number; // in ml
  workoutsCompleted: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: string;
  duration?: string;
  image: string;
  description: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: FitnessLevel;
  duration: string;
  exercises: Exercise[];
  image: string;
}

export interface ActiveWorkout extends WorkoutPlan {
  startTime: number;
  completedExercises: string[];
}

export interface AppState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: UserProfile | null;
  stats: UserStats;
}
