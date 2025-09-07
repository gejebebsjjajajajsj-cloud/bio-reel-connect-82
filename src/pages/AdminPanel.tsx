import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import FileUpload from '@/components/FileUpload';
import { Eye, RotateCcw, ArrowLeft, Settings, Image, LogOut, MessageCircle, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Analytics from '@/components/Analytics';

const AdminPanel: React.FC = () => {
  const { data, updateData, resetData, loading } = useStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  const handleMainActionChange = (index: number, field: string, value: string) => {
    const newMainActions = [...data.mainActions];
    newMainActions[index] = { ...newMainActions[index], [field]: value };
    updateData({ mainActions: newMainActions });
  };

  const handleFileUpload = async (file: File | null, type: 'logo' | 'logoImage' | 'backgroundImage' | 'backgroundVideo') => {
    // Remover arquivo
    if (!file) {
      if (type === 'logo' || type === 'logoImage') {
        updateData({ logoImage: '' });
      } else {
        updateData({ [type]: '' } as any);
      }
      toast({ title: 'Arquivo removido', description: 'O arquivo foi removido.' });
      return;
    }

    try {
      const isVideo = type === 'backgroundVideo';
      const bucket = isVideo ? 'videos' : 'profiles';
      const ext = (file.name.split('.').pop() || (isVideo ? 'mp4' : 'png')).toLowerCase();
      const folder = isVideo ? 'backgrounds' : 'uploads';
      const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: false,
          contentType: file.type,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
      const url = publicUrlData.publicUrl;

      if (type === 'logo' || type === 'logoImage') {
        updateData({ logoImage: url });
      } else {
        updateData({ [type]: url } as any);
      }

      toast({ title: 'Upload concluído', description: 'Arquivo enviado com qualidade máxima.' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Falha no upload', description: 'Tente novamente com outro arquivo.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-2">Configure seu link na bio</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/preview')}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Visualizar
            </Button>
            <Button
              variant="destructive"
              onClick={resetData}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Seção 1: Fundo da Página */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Fundo da Página
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Vídeo de Fundo</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Faça upload de um vídeo para usar como fundo da página (recomendado)
                </p>
                <FileUpload
                  onFileSelect={(file) => handleFileUpload(file, 'backgroundVideo')}
                  accept="video/mp4,video/webm"
                  currentFile={data.backgroundVideo}
                  label="Enviar Vídeo"
                  type="video"
                />
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-base font-medium">Imagem de Fundo</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Imagem que aparece se não houver vídeo ou como fallback
                </p>
                <FileUpload
                  onFileSelect={(file) => handleFileUpload(file, 'backgroundImage')}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  currentFile={data.backgroundImage}
                  label="Enviar Imagem"
                  type="image"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 2: Botões Principais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Botões Principais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Configure os 3 botões principais que aparecerão na sua página
              </p>
              {data.mainActions.map((action, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-medium text-base">Botão {index + 1}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título do Botão</Label>
                      <Input
                        value={action.title}
                        onChange={(e) => handleMainActionChange(index, 'title', e.target.value)}
                        placeholder="Ex: CATÁLOGO"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtítulo</Label>
                      <Input
                        value={action.subtitle}
                        onChange={(e) => handleMainActionChange(index, 'subtitle', e.target.value)}
                        placeholder="Ex: Veja nossa coleção completa"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Link de Destino</Label>
                    <Input
                      value={action.href}
                      onChange={(e) => handleMainActionChange(index, 'href', e.target.value)}
                      placeholder="https://exemplo.com"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção 3: Analytics do Site */}
        <Analytics />

        {/* Seção 4: Configurações do WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Mensagem Automática WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure a mensagem que será enviada automaticamente quando clicarem no botão WhatsApp
            </p>
            <div className="space-y-2">
              <Label>Mensagem Automática</Label>
              <Input
                value={data.whatsappMessage}
                onChange={(e) => handleInputChange('whatsappMessage', e.target.value)}
                placeholder="Olá! Vi seu perfil e tenho interesse nos produtos..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Salvar */}
        <div className="flex justify-center pb-8">
          <Button 
            variant="default" 
            size="lg"
            className="flex items-center gap-2"
          >
            Dados Salvos no Banco de Dados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;