
import React from 'react';

// Define props for state-based navigation
interface TabBarProps {
  currentView: string;
  onNavigate: (view: any) => void;
}

const TabBar: React.FC<TabBarProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { name: 'Home', view: 'home', icon: 'home' },
    { name: 'Train', view: 'workouts', icon: 'fitness_center' },
    { name: 'Coach', view: 'coach', icon: 'voice_chat' },
    { name: 'Status', view: 'progress', icon: 'monitoring' },
    { name: 'You', view: 'profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-charcoal/80 backdrop-blur-xl border-t border-charcoal/5 dark:border-white/5 px-2 pb-6 pt-2 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = currentView === tab.view || (currentView === 'install-guide' && tab.view === 'profile') || (currentView === 'explore' && tab.view === 'home');
          return (
            <button
              key={tab.view}
              onClick={() => onNavigate(tab.view)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive ? 'text-primary scale-110' : 'text-charcoal/40 dark:text-white/40'
              }`}
            >
              <span className="material-symbols-outlined text-[24px] font-variation-settings-fill">{tab.icon}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;
