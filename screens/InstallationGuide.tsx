import React, { useState } from 'react';

interface InstallationGuideProps {
  // Use callback for navigation
  onNavigate: (view: any) => void;
}

const InstallationGuide: React.FC<InstallationGuideProps> = ({ onNavigate }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  const steps = isIOS ? [
    { icon: 'ios_share', text: 'Tap the "Share" button at the bottom of your browser.' },
    { icon: 'add_box', text: 'Scroll down and tap "Add to Home Screen".' },
    { icon: 'check_circle', text: 'Tap "Add" in the top right corner to finish.' }
  ] : [
    { icon: 'more_vert', text: 'Tap the three dots in the top right corner of Chrome.' },
    { icon: 'install_mobile', text: 'Select "Install app" or "Add to Home screen".' },
    { icon: 'check_circle', text: 'Confirm the installation to see Fitzee on your menu.' }
  ];

  const pwaSecrets = [
    { title: 'The Manifest', desc: 'A JSON file that tells the browser how your app should look on the home screen: icons, colors, and startup URL.' },
    { title: 'Service Worker', desc: 'A background script that handles caching and allows the app to work offline or on slow networks.' },
    { title: 'Secure (HTTPS)', desc: 'PWAs require a secure connection to ensure your fitness data stays private and the app remains trustworthy.' }
  ];

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark p-6 animate-fadeIn pb-24 overflow-y-auto no-scrollbar">
      <button 
        onClick={() => onNavigate('profile')} 
        className="mb-8 w-12 h-12 bg-charcoal/5 dark:bg-white/5 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-primary/20">
          <span className="material-symbols-outlined text-4xl text-primary font-variation-settings-fill">install_mobile</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Install Fitzee</h1>
        <p className="text-sm opacity-50 px-8 leading-relaxed">Experience a native fitness tracker without the App Store bloat.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-charcoal/30 p-6 rounded-[2.5rem] border border-charcoal/5 dark:border-white/5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
            Step-by-Step for {isIOS ? 'iPhone' : 'Android'}
          </h3>
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary text-charcoal flex items-center justify-center flex-shrink-0 font-bold shadow-lg shadow-primary/20">
                  {idx + 1}
                </div>
                <div className="flex gap-3 items-center">
                  <span className="material-symbols-outlined opacity-40 text-lg">{step.icon}</span>
                  <p className="text-sm font-medium leading-snug">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-charcoal dark:bg-white text-white dark:text-charcoal p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-4xl mb-4 text-primary animate-pulse">offline_bolt</span>
            <h4 className="font-bold mb-2 text-lg">Always Connected</h4>
            <p className="text-xs opacity-60 leading-relaxed mb-6">Once installed, Fitzee leverages a Service Worker to load instantly, even when you're hitting the trails without signal.</p>
            <button 
              onClick={() => setShowTutorial(!showTutorial)}
              className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary/30 pb-1"
            >
              {showTutorial ? 'Hide PWA Tutorial' : 'Learn How PWAs Work'}
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
        </div>

        {showTutorial && (
          <div className="space-y-4 animate-slideIn">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 ml-2">PWA Masterclass</h3>
            {pwaSecrets.map((secret, i) => (
              <div key={i} className="p-6 bg-white dark:bg-charcoal/30 rounded-3xl border border-charcoal/5 dark:border-white/5">
                <h5 className="font-bold text-sm text-primary mb-2">{secret.title}</h5>
                <p className="text-xs opacity-60 leading-relaxed">{secret.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallationGuide;