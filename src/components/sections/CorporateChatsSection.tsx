import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function CorporateChatsSection({ user }: { user: any }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Корпоративные чаты</h2>
        {user.role === 'super_admin' && (
          <Button>
            <Icon name="Plus" size={18} />
            <span className="ml-2">Создать чат</span>
          </Button>
        )}
      </div>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет корпоративных чатов</p>
          <p className="text-sm mt-2">Супер админ может создавать чаты для команды</p>
        </CardContent>
      </Card>
    </div>
  );
}
