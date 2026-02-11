import React, { useState, useEffect, useCallback } from 'react';
import AuthScreen from './screens/AuthScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import WorkoutsScreen from './screens/WorkoutsScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import ExploreScreen from './screens/ExploreScreen';
import CoachScreen from './screens/CoachScreen';
import InstallationGuide from './screens/InstallationGuide';
import TabBar from './components/TabBar';
import { UserProfile, AppState, UserStats } from './types';
import { mockBackend } from './services/mockBackend';

type AppView = 'home' | 'workouts' | 'coach' | 'explore' | 'progress' | 'profile' | 'install-guide';

const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineToast, setShowOfflineToast] = useState(false);

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('fitbro_state');
    return saved ? JSON.parse(saved) : {
      isAuthenticated: false,
      isOnboarded: false,
      user: null,
      stats: {
        dailyCaloriesGoal: 2000,
        consumedCalories: 1240,
        burnedCalories: 450,
        steps: 7540,
        waterIntake: 1500,
        workoutsCompleted: 12
      }
    };
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('fitbro_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const installHandler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', installHandler);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', installHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const handleLogin = (email: string) => {
    setState(prev => ({ ...prev, isAuthenticated: true }));
  };

  const handleOnboarding = (profile: UserProfile) => {
    setState(prev => ({ ...prev, user: profile, isOnboarded: true }));
  };

  const updateStats = useCallback((updates: Partial<UserStats>) => {
    setState(prev => ({
      ...prev,
      stats: { ...prev.stats, ...updates }
    }));
  }, []);

  const handleCompleteWorkout = useCallback((caloriesBurned: number) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        burnedCalories: prev.stats.burnedCalories + caloriesBurned,
        workoutsCompleted: prev.stats.workoutsCompleted + 1
      }
    }));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fitbro_state');
    setState({
      isAuthenticated: false,
      isOnboarded: false,
      user: null,
      stats: {
        dailyCaloriesGoal: 2000,
        consumedCalories: 0,
        burnedCalories: 0,
        steps: 0,
        waterIntake: 0,
        workoutsCompleted: 0
      }
    });
    setCurrentView('home');
  };

  const syncData = async () => {
    if (!isOnline) {
      alert("You are offline. Data will sync automatically once connected.");
      return;
    }
    setIsSyncing(true);
    try {
      const result = await mockBackend.syncData(state);
      if (result.success) setLastSync(result.timestamp);
    } finally {
      setIsSyncing(false);
    }
  };

  const renderScreen = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen stats={state.stats} user={state.user} onUpdateStats={updateStats} showInstallBtn={!!deferredPrompt} onInstall={handleInstall} onNavigate={setCurrentView} />;
      case 'workouts':
        return <WorkoutsScreen onCompleteWorkout={handleCompleteWorkout} />;
      case 'coach':
        return <CoachScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'progress':
        return <ProgressScreen stats={state.stats} />;
      case 'profile':
        return <ProfileScreen user={state.user} onLogout={handleLogout} onSync={syncData} isSyncing={isSyncing} lastSync={lastSync} onNavigate={setCurrentView} />;
      case 'install-guide':
        return <InstallationGuide onNavigate={setCurrentView} />;
      default:
        return <HomeScreen stats={state.stats} user={state.user} onUpdateStats={updateStats} showInstallBtn={!!deferredPrompt} onInstall={handleInstall} onNavigate={setCurrentView} />;
    }
  };

  if (!state.isAuthenticated) return <AuthScreen onLogin={handleLogin} />;
  if (!state.isOnboarded) return <OnboardingScreen onComplete={handleOnboarding} />;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark pb-24 overflow-x-hidden font-sans transition-colors duration-300">
      {/* Offline Toast */}
      {showOfflineToast && (
        <div className={`fixed top-12 left-6 right-6 z-[200] p-4 rounded-2xl flex items-center gap-3 animate-slideIn shadow-2xl ${isOnline ? 'bg-primary text-charcoal' : 'bg-red-500 text-white'}`}>
          <span className="material-symbols-outlined">{isOnline ? 'wifi' : 'wifi_off'}</span>
          <span className="text-xs font-bold uppercase tracking-widest">
            {isOnline ? 'Back Online - Syncing...' : 'Working Offline Mode'}
          </span>
        </div>
      )}

      {renderScreen()}
      <TabBar currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;