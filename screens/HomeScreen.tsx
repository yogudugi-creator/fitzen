import React, { useState, useEffect } from 'react';
import { UserStats, UserProfile } from '../types';
import { getFitnessTip } from '../services/geminiService';

interface HomeScreenProps {
  stats: UserStats;
  user: UserProfile | null;
  onUpdateStats: (updates: Partial<UserStats>) => void;
  showInstallBtn?: boolean;
  onInstall?: () => void;
  // Use callback for navigation
  onNavigate: (view: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ stats, user, onUpdateStats, showInstallBtn, onInstall, onNavigate }) => {
  const [tip, setTip] = useState<string>("Crush your workout today!");
  const [loadingTip, setLoadingTip] = useState(true);
  const [showMealLogger, setShowMealLogger] = useState(false);
  const [mealCalories, setMealCalories] = useState('250');

  useEffect(() => {
    const fetchTip = async () => {
      setLoadingTip(true);
      const newTip = await getFitnessTip(user);
      setTip(newTip);
      setLoadingTip(false);
    };
    fetchTip();
  }, [user]);

  const waterProgress = (stats.waterIntake / 3000) * 100;

  const handleAddMeal = () => {
    const cal = parseInt(mealCalories) || 0;
    onUpdateStats({ consumedCalories: stats.consumedCalories + cal });
    setShowMealLogger(false);
  };

  return (
    <div className="px-6 pt-12 pb-24 space-y-8 animate-fadeIn">
      {showMealLogger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/60 backdrop-blur-md">
          <div className="bg-white dark:bg-charcoal p-8 rounded-[2.5rem] w-full max-w-sm animate-fadeIn border border-white/10">
            <h3 className="text-xl font-bold mb-6">Log Calories</h3>
            <input 
              type="number" 
              value={mealCalories}
              onChange={(e) => setMealCalories(e.target.value)}
              className="w-full h-16 bg-charcoal/5 dark:bg-white/5 border-none rounded-2xl text-2xl font-bold text-center mb-6 focus:ring-2 focus:ring-primary"
              placeholder="0"
            />
            <div className="flex gap-4">
              <button onClick={() => setShowMealLogger(false)} className="flex-1 h-14 bg-charcoal/5 dark:bg-white/5 rounded-2xl font-bold">Cancel</button>
              <button onClick={handleAddMeal} className="flex-1 h-14 bg-primary text-charcoal rounded-2xl font-bold">Log Meal</button>
            </div>
          </div>
        </div>
      )}

      {showInstallBtn && (
        <div className="bg-primary p-4 rounded-3xl flex items-center justify-between shadow-lg shadow-primary/20 animate-bounce-short">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-charcoal">install_mobile</span>
            <span className="text-xs font-bold text-charcoal">Fitbro for Home Screen</span>
          </div>
          <button onClick={onInstall} className="bg-charcoal text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">Install</button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hi, {user?.name || 'Athlete'} 👋</h1>
          <p className="text-charcoal/40 dark:text-white/40 font-medium">Keep moving!</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
          <img src={`https://picsum.photos/seed/${user?.name || 'fit'}/100`} alt="Avatar" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 rounded-[2rem] relative overflow-hidden">
        <div className="flex items-start gap-3 mb-3">
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Insight</span>
        </div>
        <p className={`text-sm leading-relaxed font-medium transition-opacity duration-500 ${loadingTip ? 'opacity-50' : 'opacity-100'}`}>
          "{tip}"
        </p>
      </div>

      <div className="bg-charcoal dark:bg-white text-white dark:text-charcoal p-8 rounded-[2.5rem] shadow-2xl relative">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Active Burned</p>
            <h2 className="text-5xl font-bold tracking-tighter">{stats.burnedCalories} <span className="text-sm opacity-40">kcal</span></h2>
            <div className="text-[10px] font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">bolt</span> Streak: 5 Days
            </div>
          </div>
          <div className="w-20 h-20 rounded-full border-[6px] border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-charcoal/30 p-6 rounded-[2rem] border border-charcoal/5 dark:border-white/5 relative group">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">dining</span>
            <span className="text-xs font-bold uppercase tracking-tighter opacity-40">Calories</span>
          </div>
          <span className="text-2xl font-bold block">{stats.consumedCalories}</span>
          <span className="text-[10px] font-bold opacity-40 mb-4 block">Goal: {stats.dailyCaloriesGoal}</span>
          <button onClick={() => setShowMealLogger(true)} className="w-full h-8 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all">Log Meal</button>
        </div>

        <div className="bg-white dark:bg-charcoal/30 p-6 rounded-[2rem] border border-charcoal/5 dark:border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-blue-400">water_drop</span>
            <span className="text-xs font-bold uppercase tracking-tighter opacity-40">Water</span>
          </div>
          <span className="text-2xl font-bold block relative z-10">{stats.waterIntake} ml</span>
          <div className="absolute bottom-0 left-0 right-0 bg-blue-400/10 transition-all duration-1000" style={{ height: `${Math.min(waterProgress, 100)}%` }} />
          <button onClick={() => onUpdateStats({ waterIntake: stats.waterIntake + 250 })} className="mt-4 w-full h-8 bg-blue-400/20 text-blue-400 rounded-xl text-[10px] font-bold uppercase relative z-10">Add 250ml</button>
        </div>
      </div>

      <div className="bg-primary/20 border border-primary/30 p-6 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer" onClick={() => onNavigate('explore')}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-charcoal">
            <span className="material-symbols-outlined">explore</span>
          </div>
          <div>
            <h4 className="font-bold text-sm">Explore Nearby</h4>
            <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">Find gyms & healthy eats</p>
          </div>
        </div>
        <span className="material-symbols-outlined opacity-40 group-hover:translate-x-1 transition-transform">chevron_right</span>
      </div>
    </div>
  );
};

export default HomeScreen;