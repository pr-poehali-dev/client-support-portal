import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { API_URLS } from '@/config/api';

export default function ChatsSection({ user }: { user: any }) {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadChats = async () => {
    try {
      const response = await fetch(`${API_URLS.api}?action=get-employee-chats&employeeId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error('Load chats error:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="grid gap-4">
        {chats.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет активных чатов</p>
              <p className="text-sm mt-2">Чаты будут назначены автоматически</p>
            </CardContent>
          </Card>
        ) : (
          chats.map((chat) => (
            <Card key={chat.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{chat.client_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{chat.client_phone}</p>
                  </div>
                  <Badge variant={chat.status === 'active' ? 'default' : 'secondary'}>
                    {chat.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm">
                    Создан: {new Date(chat.created_at).toLocaleString('ru-RU')}
                  </p>
                  <Button size="sm">
                    <Icon name="MessageCircle" size={16} />
                    <span className="ml-2">Открыть</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}