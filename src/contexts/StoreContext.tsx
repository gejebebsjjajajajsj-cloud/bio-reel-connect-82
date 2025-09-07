import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import backgroundVideo from '@/assets/background-video.mp4';

export interface StoreData {
  name: string;
  description: string;
  logo: string;
  logoImage: string;
  backgroundVideo: string;
  backgroundImage: string;
  whatsappMessage: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
    phone: string;
    location: string;
  };
  mainActions: Array<{
    title: string;
    subtitle: string;
    href: string;
    icon: string;
  }>;
  secondaryActions: Array<{
    title: string;
    subtitle: string;
    href: string;
    icon: string;
  }>;
}

const defaultData: StoreData = {
  name: 'GRIFFES MIL GRAU',
  description: 'AUMENTE SUA AUTOESTIMA MONTANDO UM KIT NOVO',
  logo: '👔',
  logoImage: '/lovable-uploads/cf93430e-b1b6-417e-ad5d-9896eff54b2f.png',
  backgroundVideo: 'src/assets/background-video.mp4',
  backgroundImage: '',
  whatsappMessage: 'Olá! Vi seu perfil e tenho interesse nos produtos da GRIFFES MIL GRAU. Pode me ajudar?',
  socialLinks: {
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    phone: 'tel:+5511999999999',
    location: 'https://maps.google.com'
  },
  mainActions: [
    {
      title: 'CATÁLOGO',
      subtitle: 'Veja nossa coleção completa',
      href: 'https://catalogo.com',
      icon: 'Grid3X3'
    },
    {
      title: 'LOCALIZAÇÃO',
      subtitle: 'Encontre nossa loja',
      href: 'https://maps.google.com',
      icon: 'MapPin'
    },
    {
      title: 'ATENDIMENTO WHATSAPP',
      subtitle: 'Fale conosco agora',
      href: 'https://wa.me/5511999999999',
      icon: 'MessageCircle'
    }
  ],
  secondaryActions: [
    {
      title: 'DELIVERY',
      subtitle: 'Entrega rápida',
      href: '#delivery',
      icon: 'Package'
    },
    {
      title: 'FRETE',
      subtitle: 'Consulte valores',
      href: '#frete',
      icon: 'Truck'
    },
    {
      title: 'AVALIAÇÕES',
      subtitle: 'Veja opiniões',
      href: '#avaliacoes',
      icon: 'Star'
    }
  ]
};

interface StoreContextType {
  data: StoreData;
  updateData: (newData: Partial<StoreData>) => void;
  resetData: () => void;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<StoreData>(defaultData);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    loadDataFromSupabase();
  }, []);

  const loadDataFromSupabase = async () => {
    try {
      setLoading(true);
      const { data: storeSettings, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading store data:', error);
        return;
      }

      if (storeSettings) {
        const loadedData: StoreData = {
          name: storeSettings.name,
          description: storeSettings.description,
          logo: storeSettings.logo,
          logoImage: storeSettings.logo_image,
          backgroundVideo: storeSettings.background_video || 'src/assets/background-video.mp4',
          backgroundImage: storeSettings.background_image,
          whatsappMessage: storeSettings.whatsapp_message,
          socialLinks: storeSettings.social_links as StoreData['socialLinks'],
          mainActions: storeSettings.main_actions as StoreData['mainActions'],
          secondaryActions: storeSettings.secondary_actions as StoreData['secondaryActions']
        };
        setData(loadedData);
        // Also save to localStorage as backup
        localStorage.setItem('store-data', JSON.stringify(loadedData));
      }
    } catch (error) {
      console.error('Error loading store data:', error);
      // Try to load from localStorage as fallback
      const savedData = localStorage.getItem('store-data');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (newData: Partial<StoreData>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    
    // Save to localStorage immediately for responsive UI
    localStorage.setItem('store-data', JSON.stringify(updatedData));

    // Save to Supabase
    try {
      // First, try to get the existing record
      const { data: existingRecord } = await supabase
        .from('store_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('store_settings')
          .update({
            name: updatedData.name,
            description: updatedData.description,
            logo: updatedData.logo,
            logo_image: updatedData.logoImage,
            background_video: updatedData.backgroundVideo,
            background_image: updatedData.backgroundImage,
            whatsapp_message: updatedData.whatsappMessage,
            social_links: updatedData.socialLinks,
            main_actions: updatedData.mainActions,
            secondary_actions: updatedData.secondaryActions
          })
          .eq('id', existingRecord.id);

        if (error) {
          console.error('Error updating store data:', error);
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('store_settings')
          .insert({
            name: updatedData.name,
            description: updatedData.description,
            logo: updatedData.logo,
            logo_image: updatedData.logoImage,
            background_video: updatedData.backgroundVideo,
            background_image: updatedData.backgroundImage,
            whatsapp_message: updatedData.whatsappMessage,
            social_links: updatedData.socialLinks,
            main_actions: updatedData.mainActions,
            secondary_actions: updatedData.secondaryActions
          });

        if (error) {
          console.error('Error inserting store data:', error);
        }
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
  };

  const resetData = async () => {
    setData(defaultData);
    localStorage.setItem('store-data', JSON.stringify(defaultData));
    
    // Reset in Supabase
    try {
      const { error } = await supabase
        .from('store_settings')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.error('Error resetting store data:', error);
      }
      
      // Insert default data
      await supabase.from('store_settings').insert({
        name: defaultData.name,
        description: defaultData.description,
        logo: defaultData.logo,
        logo_image: defaultData.logoImage,
        background_video: defaultData.backgroundVideo,
        background_image: defaultData.backgroundImage,
        whatsapp_message: defaultData.whatsappMessage,
        social_links: defaultData.socialLinks,
        main_actions: defaultData.mainActions,
        secondary_actions: defaultData.secondaryActions
      });
    } catch (error) {
      console.error('Error resetting data in Supabase:', error);
    }
  };

  return (
    <StoreContext.Provider value={{ data, updateData, resetData, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};