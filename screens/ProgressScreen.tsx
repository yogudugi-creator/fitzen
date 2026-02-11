
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MOCK_CHART_DATA } from '../constants';
import { UserStats } from '../types';

interface ProgressScreenProps {
  stats: UserStats;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ stats }) => {
  return (
    <div className="px-6 pt-12 pb-24 animate-fadeIn space-y-8">
      <h1 className="text-3xl font-bold">Progress</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Workouts', val: stats.workoutsCompleted, color: 'primary' },
          { label: 'Streak', val: '5d', color: 'orange-400' },
          { label: 'Avg Kcal', val: '1.2k', color: 'blue-400' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-charcoal/30 p-4 rounded-3xl border border-charcoal/5 dark:border-white/5 text-center">
            <span className="text-2xl font-bold block mb-1">{item.val}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Weight History Chart */}
      <div className="bg-white dark:bg-charcoal/30 p-6 rounded-[2.5rem] border border-charcoal/5 dark:border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Weight History</h3>
          <span className="text-xs font-bold text-primary">-1.2kg this week</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#13ec6d" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#13ec6d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} dy={10} />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#13ec6d', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#13ec6d" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calories Consistency */}
      <div className="bg-white dark:bg-charcoal/30 p-6 rounded-[2.5rem] border border-charcoal/5 dark:border-white/5">
        <h3 className="font-bold text-lg mb-6">Daily Calories</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} dy={10} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#13ec6d20' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="calories" fill="#13ec6d" radius={[6, 6, 6, 6]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="pb-8">
        <h3 className="font-bold text-lg mb-4">Achievements</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[
            { icon: 'military_tech', label: 'Consistency' },
            { icon: 'speed', label: 'Speedster' },
            { icon: 'workspace_premium', label: 'Elite' },
            { icon: 'rocket_launch', label: 'New Heights' }
          ].map((badge, idx) => (
            <div key={idx} className="flex-shrink-0 w-24 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 border-2 border-primary/20">
                <span className="material-symbols-outlined text-primary text-3xl">{badge.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-center opacity-40 uppercase tracking-tighter">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressScreen;
