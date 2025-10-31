import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ChatsSection from './sections/ChatsSection';
import CorporateChatsSection from './sections/CorporateChatsSection';
import MyShiftsSection from './sections/MyShiftsSection';
import JiraPortalSection from './sections/JiraPortalSection';
import ShiftsScheduleSection from './sections/ShiftsScheduleSection';
import MonitoringSection from './sections/MonitoringSection';
import QCPortalSection from './sections/QCPortalSection';
import QCArchiveSection from './sections/QCArchiveSection';
import KnowledgeBaseSection from './sections/KnowledgeBaseSection';
import NewsSection from './sections/NewsSection';
import ResultsSection from './sections/ResultsSection';
import EmployeesSection from './sections/EmployeesSection';
import ClientsBaseSection from './sections/ClientsBaseSection';
import AllChatsSection from './sections/AllChatsSection';
import { API_URLS } from '@/config/api';

interface EmployeeDashboardProps {
  user: any;
  onLogout: () => void;
}

const statusConfig = {
  online: { label: 'На линии', color: 'bg-green-500', value: 'online' },
  jira: { label: 'Обработка Jira', color: 'bg-blue-500', value: 'jira' },
  rest: { label: 'Отдых', color: 'bg-yellow-500', value: 'rest' },
  training: { label: 'Обучение', color: 'bg-cyan-500', value: 'training' },
  offline: { label: 'Не в сети', color: 'bg-gray-500', value: 'offline' },
};

export default function EmployeeDashboard({ user, onLogout }: EmployeeDashboardProps) {
  const [currentSection, setCurrentSection] = useState('chats');
  const [status, setStatus] = useState(user.status || 'offline');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const updateStatus = async (newStatus: string) => {
    try {
      await fetch(API_URLS.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-status', employeeId: user.id, status: newStatus }),
      });
      setStatus(newStatus);
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const menuItems = [
    { id: 'chats', label: 'Чаты с клиентами', icon: 'MessageSquare', roles: ['operator', 'admin', 'super_admin', 'okk'] },
    { id: 'corporate', label: 'Корпоративные чаты', icon: 'Users', roles: ['all'] },
    { id: 'myshifts', label: 'Мои смены', icon: 'Calendar', roles: ['all'] },
    { id: 'jira', label: 'Портал Jira', icon: 'FileText', roles: ['all'] },
    { id: 'schedule', label: 'График смен', icon: 'CalendarDays', roles: ['admin', 'super_admin', 'okk'] },
    { id: 'monitoring', label: 'Мониторинг', icon: 'Monitor', roles: ['admin', 'super_admin', 'okk'] },
    { id: 'qc', label: 'Портал QC', icon: 'CheckCircle', roles: ['admin', 'super_admin', 'okk'] },
    { id: 'qc-archive', label: 'Архив QC', icon: 'Archive', roles: ['admin', 'super_admin', 'okk'] },
    { id: 'knowledge', label: 'База знаний', icon: 'BookOpen', roles: ['all'] },
    { id: 'news', label: 'Новости', icon: 'Newspaper', roles: ['all'] },
    { id: 'results', label: 'Результат', icon: 'BarChart3', roles: ['all'] },
    { id: 'employees', label: 'Сотрудники', icon: 'UserCog', roles: ['admin', 'super_admin'] },
    { id: 'clients', label: 'База клиентов', icon: 'Database', roles: ['super_admin'] },
    { id: 'allchats', label: 'Все чаты', icon: 'MessagesSquare', roles: ['admin', 'super_admin'] },
  ];

  const hasAccess = (roles: string[]) => {
    if (roles.includes('all')) return true;
    return roles.includes(user.role);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'chats': return <ChatsSection user={user} />;
      case 'corporate': return <CorporateChatsSection user={user} />;
      case 'myshifts': return <MyShiftsSection user={user} />;
      case 'jira': return <JiraPortalSection user={user} />;
      case 'schedule': return <ShiftsScheduleSection user={user} />;
      case 'monitoring': return <MonitoringSection user={user} />;
      case 'qc': return <QCPortalSection user={user} />;
      case 'qc-archive': return <QCArchiveSection user={user} />;
      case 'knowledge': return <KnowledgeBaseSection user={user} />;
      case 'news': return <NewsSection user={user} />;
      case 'results': return <ResultsSection user={user} />;
      case 'employees': return <EmployeesSection user={user} />;
      case 'clients': return <ClientsBaseSection user={user} />;
      case 'allchats': return <AllChatsSection user={user} />;
      default: return <ChatsSection user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-card border-r border-border transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg">{user.full_name}</h2>
          <p className="text-sm text-muted-foreground">{user.role}</p>
          <div className="mt-3">
            <Select value={status} onValueChange={updateStatus}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusConfig[status as keyof typeof statusConfig].color}`} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={config.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {menuItems.filter(item => hasAccess(item.roles)).map((item) => (
            <Button
              key={item.id}
              variant={currentSection === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setCurrentSection(item.id)}
            >
              <Icon name={item.icon} size={18} />
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
            <Icon name="LogOut" size={18} />
            <span className="ml-2">Выйти</span>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border p-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Icon name="Menu" size={20} />
          </Button>
          <h1 className="text-xl font-semibold">
            {menuItems.find(item => item.id === currentSection)?.label || 'Панель управления'}
          </h1>
        </header>

        <main className="flex-1 overflow-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}