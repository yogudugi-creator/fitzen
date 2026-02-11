
import React, { useState, useEffect } from 'react';
import { ALL_EXERCISES } from '../constants';
import { Exercise } from '../types';
import { findNearbyFitness, PlaceResult } from '../services/exploreService';

const ExploreScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'nearby'>('library');
  const [search, setSearch] = useState('');
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
  
  // Nearby Fitness State
  const [loadingMaps, setLoadingMaps] = useState(false);
  const [mapsContent, setMapsContent] = useState<string>('');
  const [places, setPlaces] = useState<PlaceResult[]>([]);

  const filteredExercises = ALL_EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) || 
    ex.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleFetchNearby = () => {
    setLoadingMaps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const result = await findNearbyFitness(pos.coords.latitude, pos.coords.longitude);
        setMapsContent(result.text);
        setPlaces(result.links);
        setLoadingMaps(false);
      },
      (err) => {
        setMapsContent("Location access denied. Please enable GPS to find nearby gyms.");
        setLoadingMaps(false);
      }
    );
  };

  useEffect(() => {
    if (activeTab === 'nearby' && !mapsContent && !loadingMaps) {
      handleFetchNearby();
    }
  }, [activeTab]);

  return (
    <div className="px-6 pt-12 pb-24 animate-fadeIn">
      {/* Exercise Detail Overlay */}
      {selectedEx && (
        <div className="fixed inset-0 z-[100] bg-bg-light dark:bg-bg-dark flex flex-col p-6 animate-slideIn">
          <button onClick={() => setSelectedEx(null)} className="mb-6 w-10 h-10 bg-charcoal/5 dark:bg-white/5 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <img src={selectedEx.image} alt={selectedEx.name} className="w-full h-72 object-cover rounded-[2.5rem] mb-8 shadow-xl" />
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-lg uppercase tracking-widest">{selectedEx.category}</span>
            <h1 className="text-4xl font-bold mt-4 mb-4">{selectedEx.name}</h1>
            <p className="text-sm opacity-60 leading-relaxed mb-8">{selectedEx.description}</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Explore</h1>

      {/* Tabs */}
      <div className="flex bg-charcoal/5 dark:bg-white/5 p-1.5 rounded-2xl mb-8">
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex-1 h-12 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'library' ? 'bg-white dark:bg-charcoal text-primary shadow-sm' : 'opacity-40'}`}
        >
          Exercise Library
        </button>
        <button 
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 h-12 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'nearby' ? 'bg-white dark:bg-charcoal text-primary shadow-sm' : 'opacity-40'}`}
        >
          Nearby Fitness
        </button>
      </div>

      {activeTab === 'library' ? (
        <div className="animate-fadeIn">
          <div className="relative mb-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-20">search</span>
            <input 
              type="text" 
              placeholder="Search moves..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-white dark:bg-charcoal/30 border-none rounded-2xl focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredExercises.map(ex => (
              <div 
                key={ex.id}
                onClick={() => setSelectedEx(ex)}
                className="bg-white dark:bg-charcoal/30 p-4 rounded-[2rem] flex items-center gap-4 border border-charcoal/5 dark:border-white/5 active:scale-[0.98] transition-all"
              >
                <img src={ex.image} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{ex.name}</h4>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{ex.category}</p>
                </div>
                <span className="material-symbols-outlined opacity-20">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn space-y-6">
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-[2rem] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Smart Fitness Finder</span>
            </div>
            {loadingMaps ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold opacity-40">Scanning your area...</p>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed mb-6 whitespace-pre-line">{mapsContent}</p>
                <div className="space-y-3">
                  {places.map((place, i) => (
                    <a 
                      key={i} 
                      href={place.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white dark:bg-charcoal/40 rounded-2xl group active:scale-95 transition-all"
                    >
                      <span className="text-xs font-bold">{place.title}</span>
                      <span className="material-symbols-outlined text-primary text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
                    </a>
                  ))}
                </div>
                <button 
                  onClick={handleFetchNearby}
                  className="mt-6 w-full h-12 bg-primary text-charcoal font-bold rounded-xl text-xs uppercase tracking-widest"
                >
                  Refresh Results
                </button>
              </>
            )}
          </div>
          <p className="text-[10px] text-center opacity-40 font-bold uppercase px-8">Powered by Gemini Maps Grounding for real-time location accuracy.</p>
        </div>
      )}
    </div>
  );
};

export default ExploreScreen;
