import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { API_URLS } from '@/config/api';

export default function ClientsBaseSection({ user }: { user: any }) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await fetch(`${API_URLS.api}?action=get-clients`);
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Load clients error:', error);
    } finally {
      setLoading(false);
    }
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
      <h2 className="text-2xl font-bold mb-6">База клиентов</h2>
      <div className="grid gap-4">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Icon name="Database" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет клиентов в базе</p>
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle className="text-lg">{client.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Телефон:</strong> {client.phone}</p>
                  {client.email && <p><strong>Email:</strong> {client.email}</p>}
                  <p className="text-muted-foreground">
                    Регистрация: {new Date(client.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
