import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  Music,
  Headphones,
  Sparkles,
  Flame,
  Radio,
  FileAudio,
} from 'lucide-react';
import {
  AmbientSoundType,
  playAmbientSound,
  playCustomAudio,
  pauseCustomAudio,
  stopAmbientSound,
  setAmbientVolume,
  getAmbientStatus,
} from '../utils/audioSynth';

interface FocusAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusAudioModal: React.FC<FocusAudioModalProps> = ({ isOpen, onClose }) => {
  const [currentMode, setCurrentMode] = useState<AmbientSoundType>('none');
  const [volume, setVolume] = useState<number>(0.35);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const status = getAmbientStatus();
    setCurrentMode(status.currentSoundType);
    if (status.trackName) {
      setCustomFileName(status.trackName);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectSound = (type: AmbientSoundType) => {
    if (currentMode === type) {
      stopAmbientSound();
      setCurrentMode('none');
    } else {
      if (type === 'custom') {
        if (customAudioUrl) {
          playCustomAudio(customAudioUrl, customFileName || 'My Study Track', volume);
          setCurrentMode('custom');
        } else {
          fileInputRef.current?.click();
        }
      } else {
        playAmbientSound(type, volume);
        setCurrentMode(type);
      }
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setAmbientVolume(newVol);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomFileName(file.name);
      playCustomAudio(url, file.name, volume);
      setCurrentMode('custom');
    }
  };

  const soundOptions: {
    id: AmbientSoundType;
    title: string;
    subtitle: string;
    tag: string;
    icon: string;
    bgAccent: string;
  }[] = [
    {
      id: 'flute',
      title: 'Indian Classical Flute',
      subtitle: 'Bansuri Raag Yaman drone & meditative serene melody',
      tag: 'Soulful & Peaceful',
      icon: '🪈',
      bgAccent: 'from-amber-500/20 to-emerald-500/20 border-amber-500/30 text-amber-500',
    },
    {
      id: 'rituals',
      title: 'Melodies & Hindu Rituals',
      subtitle: '136.1Hz Cosmic Om vibration & pure brass temple bell chimes',
      tag: 'Sacred Meditation',
      icon: '🪔',
      bgAccent: 'from-orange-500/20 to-amber-600/20 border-orange-500/30 text-orange-500',
    },
    {
      id: 'instrumental',
      title: 'Instrumental Calm Tune',
      subtitle: 'Warm acoustic strings & Rhodes gentle piano harmonies',
      tag: 'Deep Focus',
      icon: '🎹',
      bgAccent: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-500',
    },
    {
      id: 'rain',
      title: 'Gentle Monsoon Rain',
      subtitle: 'Soft pink noise drizzle for continuous coding rhythm',
      tag: 'Ambient Lo-Fi',
      icon: '🌧️',
      bgAccent: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-500',
    },
    {
      id: 'waves',
      title: 'Ocean Brown Noise',
      subtitle: 'Deep tidal waves frequency that drowns hostel & library chatter',
      tag: 'Noise Blocker',
      icon: '🌊',
      bgAccent: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#0d131f] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Focus & Lo-Fi Audio Hub</span>
                {currentMode !== 'none' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Calm your mental bandwidth with classical melodies, rituals, or your device music.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Device Custom Audio Upload Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/25 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
                <FileAudio className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                  Play from Your Device
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  {customFileName ? customFileName : 'Select any MP3, WAV, Bhajan, or Lo-Fi file from your device'}
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{customFileName ? 'Change File' : 'Browse File'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {customAudioUrl && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[240px]">
                Ready: {customFileName}
              </span>
              <button
                onClick={() => handleSelectSound('custom')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentMode === 'custom'
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-500 text-stone-950 hover:bg-emerald-400'
                }`}
              >
                {currentMode === 'custom' ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>Pause Device Track</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play Custom Track</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Synthesizer & Melodies Sound List */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-400">
            Synthesized Calming Tones & Melodies
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {soundOptions.map((sound) => {
              const isActive = currentMode === sound.id;
              return (
                <button
                  key={sound.id}
                  onClick={() => handleSelectSound(sound.id)}
                  className={`p-3 sm:p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-2xl sm:text-3xl shrink-0 p-1 rounded-xl bg-white dark:bg-stone-800 shadow-xs">
                      {sound.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                          {sound.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold shrink-0">
                          {sound.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                        {sound.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {isActive ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs">
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden xs:inline">Playing</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-stone-200/60 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-emerald-500 hover:text-stone-950 transition-colors">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master Volume & Controls Footer */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              onClick={() => handleVolumeChange(volume === 0 ? 0.35 : 0)}
              className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg"
            />
            <span className="text-[11px] font-mono text-stone-500 shrink-0 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            {currentMode !== 'none' && (
              <button
                onClick={() => {
                  stopAmbientSound();
                  setCurrentMode('none');
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
              >
                Stop All Audio
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
