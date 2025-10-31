import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function ShiftsScheduleSection({ user }: { user: any }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">График смен</h2>
        <Button>
          <Icon name="Plus" size={18} />
          <span className="ml-2">Добавить смену</span>
        </Button>
      </div>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Icon name="CalendarDays" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет запланированных смен</p>
        </CardContent>
      </Card>
    </div>
  );
}
