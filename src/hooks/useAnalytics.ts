import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: 'page_view' | 'button_click';
  event_data?: {
    button_title?: string;
    button_href?: string;
    page_path?: string;
  };
}

export const useAnalytics = () => {
  const trackEvent = async ({ event_type, event_data }: AnalyticsEvent) => {
    try {
      await supabase.from('analytics').insert({
        event_type,
        event_data,
        user_agent: navigator.userAgent,
        ip_address: null // IP será capturado pelo Supabase automaticamente
      });
    } catch (error) {
      console.error('Erro ao rastrear evento:', error);
    }
  };

  const trackPageView = (page_path: string = '/') => {
    trackEvent({
      event_type: 'page_view',
      event_data: { page_path }
    });
  };

  const trackButtonClick = (button_title: string, button_href: string) => {
    trackEvent({
      event_type: 'button_click',
      event_data: { button_title, button_href }
    });
  };

  return { trackPageView, trackButtonClick };
};

export const usePageView = (page_path: string = '/') => {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView(page_path);
  }, [page_path, trackPageView]);
};