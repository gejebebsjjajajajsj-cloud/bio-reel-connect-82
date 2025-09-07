import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, MousePointer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  buttonStats: Array<{
    button_title: string;
    click_count: number;
  }>;
  recentActivity: Array<{
    event_type: string;
    event_data: any;
    created_at: string;
  }>;
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalClicks: 0,
    buttonStats: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Get total page views
      const { data: pageViews } = await supabase
        .from('analytics')
        .select('*', { count: 'exact' })
        .eq('event_type', 'page_view');

      // Get total button clicks
      const { data: buttonClicks } = await supabase
        .from('analytics')
        .select('*', { count: 'exact' })
        .eq('event_type', 'button_click');

      // Get button click stats
      const { data: allClicks } = await supabase
        .from('analytics')
        .select('event_data')
        .eq('event_type', 'button_click');

      // Process button stats
      const buttonStats: { [key: string]: number } = {};
      allClicks?.forEach(click => {
        const eventData = click.event_data as any;
        const buttonTitle = eventData?.button_title;
        if (buttonTitle) {
          buttonStats[buttonTitle] = (buttonStats[buttonTitle] || 0) + 1;
        }
      });

      const buttonStatsArray = Object.entries(buttonStats).map(([button_title, click_count]) => ({
        button_title,
        click_count
      })).sort((a, b) => b.click_count - a.click_count);

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('analytics')
        .select('event_type, event_data, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      setAnalytics({
        totalViews: pageViews?.length || 0,
        totalClicks: buttonClicks?.length || 0,
        buttonStats: buttonStatsArray,
        recentActivity: recentActivity || []
      });
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Analytics do Site
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <>
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Visitas</p>
                    <p className="text-2xl font-bold">{analytics.totalViews}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Cliques</p>
                    <p className="text-2xl font-bold">{analytics.totalClicks}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões Mais Clicados */}
            <div>
              <h3 className="font-semibold mb-3">Botões Mais Clicados</h3>
              {analytics.buttonStats.length > 0 ? (
                <div className="space-y-2">
                  {analytics.buttonStats.map((button, index) => (
                    <div key={button.button_title} className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                      <span className="font-medium">#{index + 1} {button.button_title}</span>
                      <span className="bg-primary/20 px-2 py-1 rounded text-sm font-bold">
                        {button.click_count} cliques
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum clique registrado ainda</p>
              )}
            </div>

            {/* Atividade Recente */}
            <div>
              <h3 className="font-semibold mb-3">Atividade Recente</h3>
              {analytics.recentActivity.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="text-xs p-2 bg-secondary/20 rounded">
                      <div className="flex justify-between items-start">
                        <span>
                          {activity.event_type === 'page_view' 
                            ? '👀 Visita na página' 
                            : `🔗 Clique: ${(activity.event_data as any)?.button_title || 'Botão'}`
                          }
                        </span>
                        <span className="text-muted-foreground">
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhuma atividade registrada ainda</p>
              )}
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={loadAnalytics}
                className="w-full py-2 px-4 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm font-medium transition-colors"
              >
                🔄 Atualizar Dados
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Analytics;