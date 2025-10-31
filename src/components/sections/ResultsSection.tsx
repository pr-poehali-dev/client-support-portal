import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResultsSection({ user }: { user: any }) {
  const today = new Date().toLocaleDateString('ru-RU');
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Мои результаты</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Обработано сегодня</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Среднее время (AHT)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">--</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Средняя оценка</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">--</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>За месяц</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Всего чатов:</span>
            <span className="font-bold">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Решено:</span>
            <span className="font-bold">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">НТО:</span>
            <span className="font-bold">0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
