
import React, { useState } from 'react';
import { UserProfile, FitnessGoal, FitnessLevel, Gender } from '../types';

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    gender: 'other',
    height: 175,
    weight: 70,
    goal: 'maintenance',
    level: 'beginner'
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const goals: { id: FitnessGoal; label: string; icon: string }[] = [
    { id: 'weight-loss', label: 'Lose Weight', icon: 'monitor_weight' },
    { id: 'muscle-gain', label: 'Build Muscle', icon: 'fitness_center' },
    { id: 'endurance', label: 'Improve Endurance', icon: 'sprint' },
    { id: 'flexibility', label: 'More Flexible', icon: 'self_improvement' },
    { id: 'maintenance', label: 'Stay Healthy', icon: 'favorite' },
  ];

  const levels: { id: FitnessLevel; label: string }[] = [
    { id: 'beginner', label: 'Beginner - Just starting out' },
    { id: 'intermediate', label: 'Intermediate - Active regularly' },
    { id: 'advanced', label: 'Advanced - Fitness enthusiast' },
  ];

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col p-6 overflow-y-auto">
      <div className="max-w-md mx-auto w-full flex flex-col h-full">
        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-primary' : 'bg-charcoal/10 dark:bg-white/10'}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-slideIn">
            <h1 className="text-3xl font-bold mb-2">Tell us about yourself</h1>
            <p className="text-charcoal/60 dark:text-white/60 mb-8">This helps us personalize your fitness plan.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full h-14 bg-white dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-2xl px-4 text-charcoal dark:text-white"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
                    className="w-full h-14 bg-white dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-2xl px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={e => setProfile({...profile, gender: e.target.value as Gender})}
                    className="w-full h-14 bg-white dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-2xl px-4"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={e => setProfile({...profile, height: parseInt(e.target.value)})}
                    className="w-full h-14 bg-white dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-2xl px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={e => setProfile({...profile, weight: parseInt(e.target.value)})}
                    className="w-full h-14 bg-white dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-2xl px-4"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slideIn">
            <h1 className="text-3xl font-bold mb-2">What's your goal?</h1>
            <p className="text-charcoal/60 dark:text-white/60 mb-8">Pick what motivates you the most.</p>
            
            <div className="space-y-3">
              {goals.map(g => (
                <button
                  key={g.id}
                  onClick={() => setProfile({...profile, goal: g.id})}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    profile.goal === g.id ? 'border-primary bg-primary/10' : 'border-charcoal/5 dark:border-white/5 bg-white dark:bg-charcoal/30'
                  }`}
                >
                  <span className={`material-symbols-outlined ${profile.goal === g.id ? 'text-primary' : 'text-charcoal/40 dark:text-white/40'}`}>
                    {g.icon}
                  </span>
                  <span className="font-semibold text-left">{g.label}</span>
                  {profile.goal === g.id && <span className="material-symbols-outlined ml-auto text-primary">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slideIn">
            <h1 className="text-3xl font-bold mb-2">Fitness level?</h1>
            <p className="text-charcoal/60 dark:text-white/60 mb-8">Be honest for the best experience.</p>
            
            <div className="space-y-4">
              {levels.map(l => (
                <button
                  key={l.id}
                  onClick={() => setProfile({...profile, level: l.id})}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    profile.level === l.id ? 'border-primary bg-primary/10' : 'border-charcoal/5 dark:border-white/5 bg-white dark:bg-charcoal/30'
                  }`}
                >
                  <h3 className="font-bold mb-1">{l.label.split(' - ')[0]}</h3>
                  <p className="text-sm opacity-60">{l.label.split(' - ')[1]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-10 flex gap-4">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 h-14 bg-charcoal/5 dark:bg-white/5 font-bold rounded-2xl"
            >
              Back
            </button>
          )}
          <button
            onClick={() => step < 3 ? nextStep() : onComplete(profile)}
            disabled={step === 1 && !profile.name}
            className={`flex-[2] h-14 bg-primary text-charcoal font-bold rounded-2xl transition-all ${(!profile.name && step === 1) ? 'opacity-50 grayscale' : ''}`}
          >
            {step === 3 ? 'Start My Journey' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
