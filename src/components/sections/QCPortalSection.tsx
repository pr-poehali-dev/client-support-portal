import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function QCPortalSection({ user }: { user: any }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Портал QC</h2>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет чатов для оценки</p>
          <p className="text-sm mt-2">Закрытые чаты появятся здесь для проверки качества</p>
        </CardContent>
      </Card>
    </div>
  );
}
