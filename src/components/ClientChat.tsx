import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API_URLS } from '@/config/api';

interface ClientChatProps {
  client: any;
  onLogout: () => void;
}

export default function ClientChat({ client, onLogout }: ClientChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChat = async () => {
    try {
      const response = await fetch(`${API_URLS.getClientChat}?clientId=${client.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setChatId(data.chatId);
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Load chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!chatId) return;
    try {
      const response = await fetch(`${API_URLS.api}?action=get-messages&chatId=${chatId}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    try {
      const response = await fetch(API_URLS.sendMessage, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          senderType: 'client',
          senderId: client.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Подключение к оператору...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card border-b border-border p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{client.name}</h2>
          <p className="text-sm text-muted-foreground">Чат с оператором</p>
        </div>
        <Button variant="ghost" onClick={onLogout}>
          <Icon name="LogOut" size={20} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Оператор скоро ответит. Опишите ваш вопрос.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-md ${msg.sender_type === 'client' ? 'bg-primary text-primary-foreground' : ''}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="bg-card border-t border-border p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}