import React, { useState, useRef, useEffect } from 'react';

const PLAYLIST = [
    {
        title: "Soft Guitar",
        url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
        type: "Guitar"
    },
    {
        title: "Acoustic Breeze",
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
        type: "Acoustic"
    },
    {
        title: "Soft Piano",
        url: "https://cdn.pixabay.com/download/audio/2025/03/12/audio_c75a6abeb5.mp3?filename=soft-piano-music-312509.mp3",
        type: "Piano"
    },
    {
        title: "Gentle Ambient",
        url: "https://cdn.pixabay.com/download/audio/2025/04/25/audio_d7cc5628d4.mp3?filename=gentle-ambient-atmosphere-332292.mp3",
        type: "Ambient"
    },
    {
        title: "The Beat of Nature",
        url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=the-beat-of-nature-122841.mp3",
        type: "Nature"
    },
    {
        title: "Sleep Music",
        url: "https://cdn.pixabay.com/download/audio/2024/03/10/audio_f05893f23c.mp3?filename=sleep-music-vol16-195422.mp3",
        type: "Sleep"
    }
];

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolume] = useState(0.3);
    const [isMinimized, setIsMinimized] = useState(false);

    const audioRef = useRef(new Audio(PLAYLIST[0].url));

    useEffect(() => {
        audioRef.current.volume = volume;

        const handleEnded = () => handleNext();
        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            audioRef.current.removeEventListener('ended', handleEnded);
            audioRef.current.pause();
        };
    }, []);

    useEffect(() => {
        const wasPlaying = isPlaying;
        audioRef.current.src = PLAYLIST[currentTrackIndex].url;
        audioRef.current.volume = volume;
        if (wasPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        }
    }, [currentTrackIndex]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    const handlePrev = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="w-14 h-14 bg-black/60 backdrop-blur-md border border-neon-green/50 rounded-full shadow-[0_0_20px_rgba(0,255,157,0.3)] flex items-center justify-center hover:scale-110 transition-all duration-300 group"
                >
                    <span className="text-2xl group-hover:animate-spin">💿</span>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 w-80 glass-panel-strong p-6 rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col gap-6 backdrop-blur-2xl transition-all duration-500">

            {/* Header / Track Info */}
            <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-lg shadow-black/50 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                    <div className="w-6 h-6 rounded-full bg-neon-green/20 border border-neon-green/50"></div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-white text-lg truncate leading-tight tracking-wide">{PLAYLIST[currentTrackIndex].title}</h3>
                    <p className="text-xs text-neon-green uppercase tracking-widest mt-1 font-medium">{PLAYLIST[currentTrackIndex].type}</p>
                </div>

                <button
                    onClick={() => setIsMinimized(true)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8">
                <button onClick={handlePrev} className="text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 19V5l-7 7 7 7zm8-14h-2v14h2V5z" />
                    </svg>
                </button>

                <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-neon-green transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,157,0.4)] hover:scale-105 active:scale-95"
                >
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <button onClick={handleNext} className="text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 19h2V5H4v14zm11-7l-7-7v14l7-7z" />
                    </svg>
                </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 px-2 bg-black/20 rounded-xl p-3 border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-white hover:accent-neon-green transition-colors"
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
