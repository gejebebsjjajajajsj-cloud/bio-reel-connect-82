import React, { useEffect, useRef, useMemo } from 'react';
import { useStore } from '@/contexts/StoreContext';
import storeBackground from '@/assets/store-background.jpg';
import backgroundVideo from '@/assets/background-video.mp4';

interface VideoBackgroundProps {
  children: React.ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ children }) => {
  const { data } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  
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

  // Configure simple video system - always muted, no conflicts
  useEffect(() => {
    console.log('VideoBackground: Initializing simple video system', { 
      videoUrl: videoUrl, 
      hasVideo: hasVideo 
    });
    
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Simple video end handler - ensures infinite loop
      const handleVideoEnd = () => {
        console.log('Video ended - restarting immediately for infinite loop');
        video.currentTime = 0;
        video.play().catch(e => console.error('Loop restart failed:', e));
      };
      
      // Add basic event listeners
      video.addEventListener('ended', handleVideoEnd);
      
      // Force immediate play - always muted to avoid conflicts
      const forcePlay = async () => {
        try {
          video.muted = true;
          await video.play();
          console.log('Video playing muted - infinite loop active');
        } catch (error) {
          console.error('Video failed to start:', error);
        }
      };
      
      // Start video immediately
      forcePlay();
      
      // Cleanup
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
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
          muted
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
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;