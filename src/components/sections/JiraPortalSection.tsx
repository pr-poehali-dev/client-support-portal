import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function JiraPortalSection({ user }: { user: any }) {
  const tasks = [
    { id: 1, title: 'Тестовая задача Jira', status: 'open', priority: 'high', created_at: new Date() },
  ];

  const statusLabels: Record<string, string> = {
    open: 'Открыта',
    in_progress: 'В работе',
    completed: 'Завершена'
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Портал Jira</h2>
        <Button>
          <Icon name="Plus" size={18} />
          <span className="ml-2">Создать задачу</span>
        </Button>
      </div>
      
      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет задач</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline">{statusLabels[task.status]}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Создано: {task.created_at.toLocaleDateString('ru-RU')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
