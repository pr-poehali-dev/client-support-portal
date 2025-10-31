import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function NewsSection({ user }: { user: any }) {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Icon name="Newspaper" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Новости</p>
          <p className="text-sm mt-2">Раздел в разработке</p>
        </CardContent>
      </Card>
    </div>
  );
}
