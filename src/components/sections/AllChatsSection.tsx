import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { API_URLS } from '@/config/api';

const statusLabels: Record<string, string> = {
  active: 'Активный',
  closed: 'Закрыт',
  postponed: 'Отложен'
};

const statusColors: Record<string, string> = {
  active: 'default',
  closed: 'secondary',
  postponed: 'outline'
};

export default function AllChatsSection({ user }: { user: any }) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadChats = async () => {
    try {
      const response = await fetch(`${API_URLS.api}?action=get-all-chats`);
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error('Load chats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterChats = (status: string) => {
    if (status === 'all') return chats;
    return chats.filter(chat => chat.status === status);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Все чаты</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Все ({chats.length})</TabsTrigger>
          <TabsTrigger value="active">Активные ({filterChats('active').length})</TabsTrigger>
          <TabsTrigger value="closed">Закрытые ({filterChats('closed').length})</TabsTrigger>
          <TabsTrigger value="postponed">Отложенные ({filterChats('postponed').length})</TabsTrigger>
        </TabsList>

        {['all', 'active', 'closed', 'postponed'].map(status => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="grid gap-4">
              {filterChats(status).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Icon name="MessagesSquare" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Нет чатов</p>
                  </CardContent>
                </Card>
              ) : (
                filterChats(status).map((chat) => (
                  <Card key={chat.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{chat.client_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{chat.client_phone}</p>
                        </div>
                        <Badge variant={statusColors[chat.status] as any}>
                          {statusLabels[chat.status]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Оператор:</strong> {chat.employee_name || 'Не назначен'}</p>
                        <p><strong>Создан:</strong> {new Date(chat.created_at).toLocaleString('ru-RU')}</p>
                        {chat.closed_at && (
                          <p><strong>Закрыт:</strong> {new Date(chat.closed_at).toLocaleString('ru-RU')}</p>
                        )}
                        {chat.resolution && (
                          <p><strong>Резолюция:</strong> {chat.resolution}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
