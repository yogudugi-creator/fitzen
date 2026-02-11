
import React from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile | null;
  onLogout: () => void;
  onSync: () => void;
  isSyncing: boolean;
  lastSync: string | null;
  // Use callback for navigation
  onNavigate: (view: any) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onSync, isSyncing, lastSync, onNavigate }) => {
  const settingsGroups = [
    {
      title: 'Health Data',
      items: [
        { icon: 'monitor_weight', label: 'Body Stats', value: `${user?.weight}kg` },
        { icon: 'fitness_center', label: 'Personal Best', value: '4 Records' },
        { icon: 'history', label: 'Activity Logs', value: '' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'install_mobile', label: 'Install App Guide', value: 'Free', action: () => onNavigate('install-guide') },
        { icon: 'help', label: 'Help Center', value: '' },
        { icon: 'dark_mode', label: 'Appearance', value: 'Dark' },
      ]
    }
  ];

  return (
    <div className="px-6 pt-12 pb-24 animate-fadeIn">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary p-1 bg-bg-light dark:bg-bg-dark">
            <img src={`https://picsum.photos/seed/${user?.name || 'fit'}/300`} alt="Avatar" className="w-full h-full object-cover rounded-[2rem]" />
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-charcoal rounded-2xl border-4 border-bg-light dark:border-bg-dark flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-xl font-bold">edit</span>
          </button>
        </div>
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mt-1">{user?.level} Athlete</p>
      </div>

      <div className="bg-white dark:bg-charcoal/30 p-5 rounded-[2rem] border border-charcoal/5 dark:border-white/5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isSyncing ? 'bg-primary/20 text-primary' : 'bg-charcoal/5 dark:bg-white/5 text-charcoal/40 dark:text-white/40'} flex items-center justify-center`}>
            <span className={`material-symbols-outlined ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
          </div>
          <div>
            <h4 className="text-sm font-bold">Cloud Backup</h4>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-wider">
              {lastSync ? `Synced: ${new Date(lastSync).toLocaleTimeString()}` : 'Not synced'}
            </p>
          </div>
        </div>
        <button 
          onClick={onSync}
          disabled={isSyncing}
          className="px-4 h-10 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-charcoal transition-all disabled:opacity-50"
        >
          {isSyncing ? '...' : 'Sync'}
        </button>
      </div>

      <div className="bg-charcoal dark:bg-white text-white dark:text-charcoal p-6 rounded-[2.5rem] flex justify-around mb-10">
        <div className="text-center">
          <span className="text-xl font-bold block">{user?.weight}</span>
          <span className="text-[8px] font-bold uppercase opacity-40">Weight</span>
        </div>
        <div className="text-center">
          <span className="text-xl font-bold block">{user?.height}</span>
          <span className="text-[8px] font-bold uppercase opacity-40">Height</span>
        </div>
        <div className="text-center">
          <span className="text-xl font-bold block">{user?.age}</span>
          <span className="text-[8px] font-bold uppercase opacity-40">Age</span>
        </div>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40 dark:text-white/40 mb-4 ml-2">
              {group.title}
            </h3>
            <div className="bg-white dark:bg-charcoal/30 rounded-[2rem] border border-charcoal/5 dark:border-white/5 overflow-hidden">
              {group.items.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 p-5 text-left active:bg-charcoal/5 dark:active:bg-white/5 transition-colors ${
                    i !== group.items.length - 1 ? 'border-b border-charcoal/5 dark:border-white/5' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-charcoal/5 dark:bg-white/5 flex items-center justify-center text-charcoal/60 dark:text-white/60">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <span className="font-bold text-sm flex-1">{item.label}</span>
                  <span className="text-xs font-bold text-primary">{item.value}</span>
                  <span className="material-symbols-outlined text-charcoal/20 dark:text-white/20">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onLogout}
        className="w-full h-16 bg-red-500/10 text-red-500 font-bold rounded-2xl mt-12 mb-8 flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined">logout</span>
        Log Out
      </button>
    </div>
  );
};

export default ProfileScreen;
