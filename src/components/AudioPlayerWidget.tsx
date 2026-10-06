import React, { useState, useEffect } from 'react';
import { calmMusic } from '../utils/audioEngine.ts';

interface AudioPlayerWidgetProps {
  onReplayIntro: () => void;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({ onReplayIntro }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const update = () => {
      const status = calmMusic.getStatus();
      setIsPlaying(status.isPlaying);
      setIsMuted(status.isMuted);
    };

    update();
    const unsubscribe = calmMusic.subscribe(update);
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      if (isMuted) {
        calmMusic.toggleMute();
      } else {
        calmMusic.stopMusic();
      }
    } else {
      await calmMusic.startMusic();
    }
  };

  const handleToggleMute = () => {
    calmMusic.toggleMute();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono text-xs select-none">
      <div className="flex items-center gap-2">
        {/* Expanded Popover Controls */}
        {showControls && (
          <div className="shape-octagon bg-[#3E1F4D]/95 border border-[#E2A9F0]/40 p-3 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fadeIn text-[#E8E2D0]">
            <button
              onClick={onReplayIntro}
              className="hover:text-[#E2A9F0] transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider text-[11px] px-2 py-1 bg-white/5 shape-octagon hover:bg-white/10"
              title="Replay shooting star intro animation"
            >
              <span>★</span>
              <span>REPLAY INTRO</span>
            </button>
            <span className="text-[#E2A9F0]/30 select-none">|</span>
            <span className="text-[10px] text-[#E8E2D0]/60 uppercase tracking-widest">CALM AMBIENT</span>
          </div>
        )}

        {/* Main Floating Pill / Octagon Audio Button */}
        <div className="shape-octagon bg-[#3E1F4D]/90 hover:bg-[#4A2260] border border-[#E2A9F0]/40 backdrop-blur-md shadow-xl flex items-center p-1.5 transition-all">
          <button
            onClick={handleToggleMute}
            className="flex items-center gap-2 px-3 py-1 text-[#E8E2D0] hover:text-[#E2A9F0] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Calm Music' : 'Mute Calm Music'}
            aria-label="Toggle Sound"
          >
            {/* Animated Sound Waves when playing & unmuted */}
            {isPlaying && !isMuted ? (
              <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                <span className="w-0.5 bg-[#E2A9F0] h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-[#B01FD6] h-2/3 animate-[pulse_1.2s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-[#E8E2D0] h-4/5 animate-[pulse_0.6s_ease-in-out_infinite]" />
              </div>
            ) : (
              <span className="text-xs text-[#E8E2D0]/60">✕</span>
            )}

            <span className="text-[11px] font-bold tracking-wider uppercase">
              {isMuted ? 'MUSIC OFF' : 'CALM MUSIC'}
            </span>
          </button>

          {/* Quick toggle options button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="px-1.5 py-1 text-[#E2A9F0]/80 hover:text-white transition-colors cursor-pointer border-l border-white/10"
            title="Audio & intro options"
            aria-label="Audio options"
          >
            <span className="text-[10px]">⚙</span>
          </button>
        </div>
      </div>
    </div>
  );
};
