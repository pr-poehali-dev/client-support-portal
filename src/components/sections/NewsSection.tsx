import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewsSection({ user }: { user: any }) {
  const news = [
    { id: 1, title: 'Обновление системы', date: '2025-10-30', content: 'Система обновлена до новой версии' },
    { id: 2, title: 'Новые правила работы', date: '2025-10-29', content: 'Обновлены правила обработки чатов' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Новости</h2>
      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString('ru-RU')}</p>
            </CardHeader>
            <CardContent>
              <p>{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
