import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import storeBackground from '@/assets/store-background.jpg';
import backgroundVideo from '@/assets/background-video.mp4';

interface VideoBackgroundProps {
  children: React.ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ children }) => {
  const { data } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showAudioControl, setShowAudioControl] = useState(false);
  
  // Memoize video URL to prevent unnecessary re-renders  
  const videoUrl = useMemo(() => {
    // Always default to the built-in video if no custom video is set
    if (!data.backgroundVideo || data.backgroundVideo === 'src/assets/background-video.mp4') {
      return backgroundVideo;
    }
    return data.backgroundVideo;
  }, [data.backgroundVideo]);
  
  const hasVideo = Boolean(videoUrl);
  const videoType = videoUrl?.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
  
  // Never show background image if we have any video (including default)
  const shouldShowBackgroundImage = !hasVideo && data.backgroundImage;

  // Função para controlar áudio
  const toggleAudio = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      video.muted = newMutedState;
      video.volume = newMutedState ? 0 : 0.3;
      console.log(`Audio ${newMutedState ? 'muted' : 'unmuted'}`);
    }
  };

  // Configure ultra-robust video system - NEVER lets video stop
  useEffect(() => {
    console.log('VideoBackground: Initializing bulletproof video system', { 
      videoUrl: videoUrl, 
      hasVideo: hasVideo 
    });
    
    if (videoRef.current) {
      const video = videoRef.current;
      let isIntentionalPause = false;
      
      // Ultra-robust video end handler - ensures infinite loop
      const handleVideoEnd = () => {
        console.log('Video ended - restarting immediately for infinite loop');
        video.currentTime = 0;
        video.play().catch(e => console.error('Loop restart failed:', e));
      };
      
      // Smart pause detection - only restart if not intentionally paused
      const handlePause = () => {
        if (!isIntentionalPause && video.readyState >= 2) {
          setTimeout(() => {
            if (!isIntentionalPause && video.paused) {
              console.log('Video paused unexpectedly - restarting');
              video.play().catch(e => console.error('Auto-restart failed:', e));
            }
          }, 100);
        }
      };
      
      // Prevent video from ever being truly paused
      const preventPause = (e: Event) => {
        if (!isIntentionalPause) {
          e.preventDefault();
          setTimeout(() => video.play(), 10);
        }
      };
      
      // Add bulletproof event listeners
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('pause', handlePause);
      video.addEventListener('suspend', preventPause);
      video.addEventListener('stalled', () => video.load());
      
      // Force immediate play with progressive fallbacks
      const forcePlay = async () => {
        try {
          // Primeiro tenta com áudio baixo
          video.muted = false;
          video.volume = 0.3;
          await video.play();
          console.log('Video playing with audio - infinite loop active');
          setIsMuted(false);
          setShowAudioControl(true);
        } catch (error) {
          console.log('Autoplay com áudio bloqueado - usando fallback mudo');
          video.muted = true;
          setIsMuted(true);
          try {
            await video.play();
            console.log('Video playing muted - infinite loop active');
            setShowAudioControl(true);
          } catch (mutedError) {
            console.error('Critical: Video failed to start:', mutedError);
          }
        }
      };
      
      // Start video immediately
      forcePlay();
      
      // Cleanup
      return () => {
        isIntentionalPause = true;
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('suspend', preventPause);
        video.removeEventListener('stalled', () => video.load());
      };
    }
  }, [videoUrl, hasVideo, data.backgroundVideo]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      {hasVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster={data.backgroundImage || undefined}
          onLoadStart={() => console.log('Video load started')}
          onLoadedData={() => console.log('Video loaded successfully')}
          onError={(e) => console.error('Video error:', e)}
          onPlay={() => console.log('Video started playing')}
          onEnded={() => console.log('Video ended (should loop)')}
          style={{ 
            filter: 'none',
            transform: 'none'
          }}
        >
          <source src={videoUrl} type={videoType} />
        </video>
      )}
      
      {/* Background Image (only when no video exists and custom image is set) */}
      {shouldShowBackgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>
      )}
      
      {/* Gradient overlay when video exists */}
      {hasVideo && <div className="absolute inset-0 bg-gradient-overlay" />}
      
      {/* Audio Control Button */}
      {hasVideo && showAudioControl && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 transition-all duration-300"
          onClick={toggleAudio}
          aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;