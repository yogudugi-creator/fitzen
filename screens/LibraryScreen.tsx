
import React, { useState } from 'react';
import { ALL_EXERCISES } from '../constants';
import { Exercise } from '../types';

const LibraryScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);

  const filtered = ALL_EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) || 
    ex.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 pt-12 pb-24 animate-fadeIn">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-charcoal/5 dark:bg-white/5 rounded-3xl">
                <span className="text-[10px] font-bold uppercase opacity-40 block mb-1">Target Sets</span>
                <span className="text-xl font-bold">{selectedEx.sets}</span>
              </div>
              <div className="p-6 bg-charcoal/5 dark:bg-white/5 rounded-3xl">
                <span className="text-[10px] font-bold uppercase opacity-40 block mb-1">Recommended Reps</span>
                <span className="text-xl font-bold">{selectedEx.reps}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Exercise Library</h1>
      
      <div className="relative mb-8">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-20">search</span>
        <input 
          type="text" 
          placeholder="Search exercises..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-14 pl-12 pr-4 bg-white dark:bg-charcoal/30 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(ex => (
          <div 
            key={ex.id}
            onClick={() => setSelectedEx(ex)}
            className="bg-white dark:bg-charcoal/30 p-4 rounded-[2rem] flex items-center gap-4 border border-charcoal/5 dark:border-white/5 active:scale-[0.98] transition-all"
          >
            <img src={ex.image} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <h4 className="font-bold">{ex.name}</h4>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{ex.category}</p>
            </div>
            <span className="material-symbols-outlined opacity-20">chevron_right</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryScreen;
