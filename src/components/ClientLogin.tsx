import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { API_URLS } from '@/config/api';

interface ClientLoginProps {
  onLogin: (clientData: any) => void;
  onShowEmployeeLogin: () => void;
}

export default function ClientLogin({ onLogin, onShowEmployeeLogin }: ClientLoginProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Имя и телефон обязательны для заполнения',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URLS.clientLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim() || null }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: data.isNew ? 'Вы зарегистрированы' : 'С возвращением!',
        });
        onLogin(data.client);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось войти',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с подключением к серверу',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Клиентская поддержка</CardTitle>
          <CardDescription>Заполните форму для начала чата с оператором</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                placeholder="Введите ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона *</Label>
              <Input
                id="phone"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Подключение...' : 'Начать чат'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={onShowEmployeeLogin} className="text-sm">
              Вход для сотрудников
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}