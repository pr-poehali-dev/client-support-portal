import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function QCPortalSection({ user }: { user: any }) {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Портал QC</p>
          <p className="text-sm mt-2">Раздел в разработке</p>
        </CardContent>
      </Card>
    </div>
  );
}
