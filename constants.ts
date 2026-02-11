
import { WorkoutPlan, Exercise } from './types';

export const ALL_EXERCISES: Exercise[] = [
  { id: 'ex-1', name: 'Jumping Jacks', category: 'Cardio', sets: 3, reps: '45 sec', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80', description: 'A classic cardio move. Start with feet together and arms at sides. Jump to spread legs and bring arms above head.' },
  { id: 'ex-2', name: 'Push-ups', category: 'Strength', sets: 3, reps: '10-15', image: 'https://images.unsplash.com/photo-1598971639058-aba3c3ef9099?w=400&q=80', description: 'Upper body strength builder. Keep core tight, lower chest to floor, and push back up.' },
  { id: 'ex-3', name: 'Squats', category: 'Strength', sets: 3, reps: '15-20', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80', description: 'Lower body essential. Sit back into hips, keeping knees over ankles and chest up.' },
  { id: 'ex-4', name: 'Plank Hold', category: 'Core', sets: 3, reps: '60 sec', image: 'https://images.unsplash.com/photo-1548691905-57c36cc8d93f?w=400&q=80', description: 'Core stability. Maintain a straight line from head to heels while resting on forearms.' },
  { id: 'ex-5', name: 'Leg Raises', category: 'Core', sets: 4, reps: '20', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', description: 'Target lower abs. Lay flat, lift legs to 90 degrees without bending knees.' },
  { id: 'ex-6', name: 'Lunges', category: 'Legs', sets: 3, reps: '12 per leg', image: 'https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?w=400&q=80', description: 'Leg definition. Step forward and drop back knee towards the floor.' },
  // New Yoga Exercises
  { id: 'yoga-1', name: 'Sun Salutation', category: 'Yoga', sets: 5, reps: 'Cycles', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', description: 'A dynamic sequence of 12 poses. Connect movement with breath to warm up the entire body.' },
  { id: 'yoga-2', name: 'Warrior II', category: 'Yoga', sets: 3, reps: '45 sec', image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=400&q=80', description: 'Strong standing pose. Focus on leg strength, hip opening, and steady gaze over your front hand.' },
  { id: 'yoga-3', name: 'Downward Dog', category: 'Yoga', sets: 3, reps: '60 sec', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80', description: 'Inversion pose that stretches the hamstrings and strengthens the shoulders. Keep your spine long.' },
  { id: 'yoga-4', name: 'Tree Pose', category: 'Yoga', sets: 2, reps: '30 sec/side', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&q=80', description: 'Balance and focus. Place your foot on the inner thigh or calf (avoid the knee joint).' },
  { id: 'yoga-5', name: 'Child\'s Pose', category: 'Yoga', sets: 1, reps: '2 min', image: 'https://images.unsplash.com/photo-1510894347713-fc3ad6cb0d42?w=400&q=80', description: 'Resting pose. Rest your forehead on the mat and sink your hips back onto your heels.' }
];

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'wp-1',
    title: 'Full Body Ignition',
    description: 'A high-intensity beginner routine to jumpstart your metabolism.',
    difficulty: 'beginner',
    duration: '25 min',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    exercises: [ALL_EXERCISES[0], ALL_EXERCISES[1], ALL_EXERCISES[2]]
  },
  {
    id: 'wp-yoga-1',
    title: 'Sunrise Yoga Flow',
    description: 'Awaken your body and mind with this gentle flexibility sequence.',
    difficulty: 'beginner',
    duration: '15 min',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    exercises: [ALL_EXERCISES[6], ALL_EXERCISES[8], ALL_EXERCISES[9], ALL_EXERCISES[10]]
  },
  {
    id: 'wp-2',
    title: 'Core Crusher Pro',
    description: 'Advanced abdominal conditioning for a rock-solid midsection.',
    difficulty: 'advanced',
    duration: '15 min',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    exercises: [ALL_EXERCISES[3], ALL_EXERCISES[4], ALL_EXERCISES[7]]
  },
  {
    id: 'wp-3',
    title: 'Lean & Toned',
    description: 'Targeted intermediate movements for muscle definition.',
    difficulty: 'intermediate',
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80',
    exercises: [ALL_EXERCISES[5], ALL_EXERCISES[2], ALL_EXERCISES[1]]
  }
];

export const MOCK_CHART_DATA = [
  { day: 'Mon', calories: 1800, weight: 82.5 },
  { day: 'Tue', calories: 2100, weight: 82.3 },
  { day: 'Wed', calories: 1600, weight: 82.2 },
  { day: 'Thu', calories: 1950, weight: 82.0 },
  { day: 'Fri', calories: 2300, weight: 81.8 },
  { day: 'Sat', calories: 2500, weight: 81.9 },
  { day: 'Sun', calories: 1800, weight: 81.7 },
];
