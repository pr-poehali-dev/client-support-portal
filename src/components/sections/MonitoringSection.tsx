import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { API_URLS } from '@/config/api';

const statusConfig: Record<string, { label: string; color: string }> = {
  online: { label: 'На линии', color: 'bg-green-500' },
  jira: { label: 'Обработка Jira', color: 'bg-blue-500' },
  rest: { label: 'Отдых', color: 'bg-yellow-500' },
  training: { label: 'Обучение', color: 'bg-cyan-500' },
  offline: { label: 'Не в сети', color: 'bg-gray-500' }
};

export default function MonitoringSection({ user }: { user: any }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [employeesRes, chatsRes] = await Promise.all([
        fetch(`${API_URLS.api}?action=get-employees`),
        fetch(`${API_URLS.api}?action=get-all-chats`)
      ]);
      
      if (employeesRes.ok && chatsRes.ok) {
        const employeesData = await employeesRes.json();
        const chatsData = await chatsRes.json();
        setEmployees(employeesData.employees || []);
        setChats(chatsData.chats || []);
      }
    } catch (error) {
      console.error('Load monitoring data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeChatsCount = (employeeId: number) => {
    return chats.filter(chat => chat.assigned_employee_id === employeeId && chat.status === 'active').length;
  };

  const getEmployeeClosedChatsCount = (employeeId: number) => {
    return chats.filter(chat => chat.assigned_employee_id === employeeId && chat.status === 'closed').length;
  };

  const getEmployeeState = (emp: any) => {
    const activeChats = getEmployeeChatsCount(emp.id);
    if (activeChats > 0) return { label: 'Чат', color: 'bg-green-500' };
    if (emp.status === 'online') return { label: 'Простой', color: 'bg-yellow-500' };
    return { label: statusConfig[emp.status]?.label || 'Не в сети', color: statusConfig[emp.status]?.color || 'bg-gray-500' };
  };

  const activeEmployees = employees.filter(e => e.status !== 'offline');

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Мониторинг операторов</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Всего операторов</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">На линии</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {employees.filter(e => e.status === 'online').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Активных чатов</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">
              {chats.filter(c => c.status === 'active').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {activeEmployees.map((emp) => {
          const state = getEmployeeState(emp);
          const activeChats = getEmployeeChatsCount(emp.id);
          const closedChats = getEmployeeClosedChatsCount(emp.id);
          
          return (
            <Card key={emp.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{emp.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{emp.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={state.color}>{state.label}</Badge>
                    <div className={`w-2 h-2 rounded-full ${statusConfig[emp.status]?.color || 'bg-gray-500'} mt-2`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Активные чаты</p>
                    <p className="text-xl font-bold">{activeChats}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Обработано</p>
                    <p className="text-xl font-bold">{closedChats}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Статус</p>
                    <p className="text-sm font-medium">{statusConfig[emp.status]?.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
