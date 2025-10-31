import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function MyShiftsSection({ user }: { user: any }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Мои смены</h2>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет запланированных смен</p>
          <p className="text-sm mt-2">Смены назначаются администратором</p>
        </CardContent>
      </Card>
    </div>
  );
}
