import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function KnowledgeBaseSection({ user }: { user: any }) {
  const [search, setSearch] = useState('');
  
  const articles = [
    { id: 1, title: 'Как обрабатывать запросы клиентов', category: 'Основы работы' },
    { id: 2, title: 'Политика конфиденциальности', category: 'Правила' },
    { id: 3, title: 'Работа с Jira', category: 'Инструкции' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">База знаний</h2>
      <div className="mb-4">
        <Input
          placeholder="Поиск по базе знаний..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{article.category}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Кликните для просмотра статьи
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
