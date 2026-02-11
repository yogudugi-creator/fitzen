
import React, { useState, useEffect } from 'react';
import { WORKOUT_PLANS } from '../constants';
import { FitnessLevel, WorkoutPlan, Exercise } from '../types';
import { generateCustomWorkout } from '../services/workoutService';

interface WorkoutsScreenProps {
  onCompleteWorkout: (calories: number) => void;
}

type WorkoutFilter = FitnessLevel | 'all' | 'yoga';

const WorkoutsScreen: React.FC<WorkoutsScreenProps> = ({ onCompleteWorkout }) => {
  const [filter, setFilter] = useState<WorkoutFilter>('all');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [moodInput, setMoodInput] = useState('');

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleGenerateAI = async () => {
    if (!moodInput) return;
    setIsGenerating(true);
    try {
      const result = await generateCustomWorkout(null, moodInput);
      const aiPlan: WorkoutPlan = {
        id: 'ai-' + Date.now(),
        title: result.title,
        description: `Custom generated workout: ${moodInput}`,
        difficulty: 'intermediate',
        duration: '15 min',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        exercises: result.exercises.map((ex, i) => ({
          id: 'ai-ex-' + i,
          name: ex.name || 'Exercise',
          category: 'Custom',
          sets: ex.sets || 3,
          reps: ex.reps || '12',
          description: ex.description || '',
          image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80'
        }))
      };
      setSelectedWorkout(aiPlan);
      setMoodInput('');
    } catch (err) {
      alert("AI generator is busy right now. Try a pre-made plan!");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExercise = (id: string) => {
    setCompletedExercises(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const burned = selectedWorkout?.difficulty === 'advanced' ? 450 : selectedWorkout?.difficulty === 'intermediate' ? 300 : 150;
    onCompleteWorkout(burned);
    setIsActive(false);
    setSelectedWorkout(null);
    setCompletedExercises([]);
    setTimer(0);
  };

  const filteredPlans = WORKOUT_PLANS.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'yoga') return p.title.toLowerCase().includes('yoga') || p.exercises.some(e => e.category === 'Yoga');
    return p.difficulty === filter;
  });

  if (isActive && selectedWorkout) {
    return (
      <div className="fixed inset-0 z-[100] bg-bg-dark text-white p-6 flex flex-col animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold">{selectedWorkout.title}</h2>
            <p className="text-primary font-bold">{formatTime(timer)}</p>
          </div>
          <button onClick={() => setIsActive(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
          {selectedWorkout.exercises.map((ex) => (
            <div 
              key={ex.id} 
              onClick={() => toggleExercise(ex.id)}
              className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${
                completedExercises.includes(ex.id) ? 'bg-primary/20 border-primary' : 'bg-white/5 border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${completedExercises.includes(ex.id) ? 'bg-primary border-primary' : 'border-white/20'}`}>
                {completedExercises.includes(ex.id) && <span className="material-symbols-outlined text-bg-dark text-sm">check</span>}
              </div>
              <div className="flex-1">
                <h4 className="font-bold">{ex.name}</h4>
                <p className="text-xs opacity-40">{ex.sets} sets • {ex.reps}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleFinish} className="mt-6 h-16 bg-primary text-charcoal font-bold rounded-2xl shadow-xl">Finish Workout</button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-24 animate-fadeIn">
      {selectedWorkout ? (
        <div className="animate-slideIn">
          <button onClick={() => setSelectedWorkout(null)} className="mb-6 flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined">arrow_back</span> Back
          </button>
          <div className="rounded-[2.5rem] overflow-hidden bg-white dark:bg-charcoal/30 mb-8 border border-charcoal/5 dark:border-white/5">
            <img src={selectedWorkout.image} className="w-full h-64 object-cover" />
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-6">{selectedWorkout.title}</h1>
              <div className="space-y-4">
                {selectedWorkout.exercises.map((ex) => (
                  <div key={ex.id} className="flex gap-4 items-center p-4 bg-charcoal/5 dark:bg-white/5 rounded-2xl">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{ex.name}</h4>
                      <p className="text-[10px] opacity-40 font-bold uppercase">{ex.reps} x {ex.sets} sets</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsActive(true)} className="mt-8 w-full h-16 bg-primary text-charcoal font-bold rounded-2xl">Start Workout</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Workouts</h1>

          {/* AI Generator Card */}
          <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] p-6 rounded-[2.5rem] text-white mb-10 shadow-xl shadow-purple-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-white">auto_awesome</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Smart Build</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Generate AI Session</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={moodInput}
                  onChange={(e) => setMoodInput(e.target.value)}
                  placeholder="e.g. Zen yoga, 15 min legs..." 
                  className="flex-1 h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-xs placeholder:text-white/40 focus:ring-0"
                />
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !moodInput}
                  className="w-12 h-12 bg-white text-purple-600 rounded-xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined">bolt</span>
                  )}
                </button>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar py-1">
            {['all', 'beginner', 'intermediate', 'advanced', 'yoga'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl as any)}
                className={`px-6 h-10 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === lvl ? 'bg-primary text-charcoal' : 'bg-white dark:bg-charcoal/30 border border-charcoal/10'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredPlans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedWorkout(plan)}
                className="bg-white dark:bg-charcoal/30 rounded-[2rem] p-4 flex gap-4 border border-charcoal/5 active:scale-[0.98] transition-all"
              >
                <div className="relative">
                  <img src={plan.image} className="w-20 h-20 rounded-2xl object-cover" />
                  {plan.title.toLowerCase().includes('yoga') && (
                    <div className="absolute -top-1 -right-1 bg-teal-400 text-[8px] text-white font-bold px-2 py-0.5 rounded-full uppercase">Zen</div>
                  )}
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="font-bold text-lg leading-tight">{plan.title}</h3>
                  <p className="text-[10px] font-bold opacity-40 uppercase">{plan.difficulty} • {plan.duration}</p>
                </div>
                <span className="material-symbols-outlined self-center opacity-20">chevron_right</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutsScreen;
