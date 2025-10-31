import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { API_URLS } from '@/config/api';

interface EmployeeLoginProps {
  onLogin: (employeeData: any) => void;
  onBack: () => void;
}

export default function EmployeeLogin({ onLogin, onBack }: EmployeeLoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login.trim() || !password.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите логин и пароль',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URLS.employeeLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: login.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: `Добро пожаловать, ${data.employee.full_name}`,
        });
        onLogin(data.employee);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Неверный логин или пароль',
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
          <Button variant="ghost" onClick={onBack} className="w-fit mb-2">
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>
          <CardTitle className="text-2xl">Вход для сотрудников</CardTitle>
          <CardDescription>Используйте корпоративные учетные данные</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}