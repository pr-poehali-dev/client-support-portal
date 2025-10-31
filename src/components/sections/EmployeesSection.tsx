import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_URLS } from '@/config/api';

const roleLabels: Record<string, string> = {
  operator: 'Оператор КЦ',
  okk: 'ОКК',
  editor: 'Редактор',
  admin: 'Админ',
  super_admin: 'Супер Админ'
};

const statusLabels: Record<string, string> = {
  online: 'На линии',
  jira: 'Обработка Jira',
  rest: 'Отдых',
  training: 'Обучение',
  offline: 'Не в сети'
};

export default function EmployeesSection({ user }: { user: any }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    full_name: '',
    role: 'operator',
    skills: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await fetch(`${API_URLS.api}?action=get-employees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Load employees error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!formData.login || !formData.password || !formData.full_name) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(API_URLS.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-employee', ...formData }),
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Сотрудник добавлен' });
        setShowAddDialog(false);
        setFormData({ login: '', password: '', full_name: '', role: 'operator', skills: '' });
        loadEmployees();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить сотрудника', variant: 'destructive' });
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление сотрудниками</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="UserPlus" size={18} />
              <span className="ml-2">Добавить сотрудника</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый сотрудник</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>ФИО *</Label>
                <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
              </div>
              <div>
                <Label>Логин *</Label>
                <Input value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} />
              </div>
              <div>
                <Label>Пароль *</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div>
                <Label>Роль</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Навыки</Label>
                <Input value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Через запятую" />
              </div>
              <Button onClick={handleAddEmployee} className="w-full">Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {employees.map((emp) => (
          <Card key={emp.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{emp.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">@{emp.login}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{roleLabels[emp.role]}</Badge>
                  <Badge>{statusLabels[emp.status]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {emp.skills && (
                <p className="text-sm">
                  <strong>Навыки:</strong> {emp.skills}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
