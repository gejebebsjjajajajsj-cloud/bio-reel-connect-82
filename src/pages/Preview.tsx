import React from 'react';
import VideoBackground from '@/components/VideoBackground';
import Logo from '@/components/Logo';
import ActionButtons from '@/components/ActionButtons';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Preview = () => {
  const { data, loading } = useStore();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back to Admin Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="link-action"
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Painel
        </Button>
      </div>

      <VideoBackground>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 relative animate-scale-in">
              <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center shadow-glow overflow-hidden">
                {data.logoImage ? (
                  <img 
                    src={data.logoImage} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-primary-foreground font-bold text-lg flex flex-col items-center">
                    <div className="text-2xl">{data.logo}</div>
                    <div className="text-xs mt-1">STYLE</div>
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              {data.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Action Buttons */}
          <ActionButtons />

          {/* Footer */}
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <p className="text-sm text-muted-foreground">
              © 2024 {data.name} - Link na Bio Premium
            </p>
          </div>
        </div>
      </VideoBackground>
    </div>
  );
};

export default Preview;