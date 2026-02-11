import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const CoachScreen: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const audioCtx = audioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
              const source = audioCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(audioCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => console.error("Live API Error:", e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: "You are the Fitbro AI Coach. You are a world-class trainer known for high energy and scientific accuracy. Motivate the user, check their form, and keep responses concise and spoken."
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setTranscription('');
  };

  return (
    <div className="min-h-screen px-6 pt-12 pb-24 flex flex-col items-center justify-center bg-bg-dark animate-fadeIn text-white overflow-hidden">
      <div className={`w-64 h-64 rounded-full flex items-center justify-center relative transition-all duration-1000 ${isActive ? 'scale-110 shadow-[0_0_100px_rgba(19,236,109,0.3)]' : 'scale-100'}`}>
        <div className={`absolute inset-0 rounded-full border-4 border-primary transition-all duration-500 ${isActive ? 'animate-ping opacity-20' : 'opacity-10'}`}></div>
        <div className={`w-48 h-48 rounded-full bg-charcoal flex items-center justify-center border-4 border-primary/20 relative z-10`}>
          <span className={`material-symbols-outlined text-7xl text-primary ${isActive ? 'animate-pulse' : ''}`}>
            {isActive ? 'graphic_eq' : 'mic_none'}
          </span>
        </div>
      </div>

      <div className="mt-12 text-center space-y-4 max-w-xs">
        <h1 className="text-3xl font-bold">Fit<span className="text-primary">bro</span> Coach</h1>
        <p className="text-sm opacity-50">High-intensity AI voice coaching on demand.</p>
        
        {transcription && (
          <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-xs italic opacity-80 animate-fadeIn">
            "{transcription}"
          </div>
        )}
      </div>

      <div className="mt-auto w-full flex flex-col gap-4">
        {!isActive ? (
          <button 
            onClick={startSession}
            disabled={isConnecting}
            className="w-full h-16 bg-primary text-charcoal font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            {isConnecting ? (
              <><div className="w-5 h-5 border-2 border-charcoal border-t-transparent rounded-full animate-spin"></div> Syncing AI...</>
            ) : (
              <><span className="material-symbols-outlined">electric_bolt</span> Start Coach</>
            )}
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="w-full h-16 bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">stop</span> End Session
          </button>
        )}
      </div>
    </div>
  );
};

export default CoachScreen;