import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

type ScheduleEntry = {
  id: string;
  date: Date;
  content: string;
};

function App() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [content, setContent] = useState('');
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);

  const handleAddEntry = () => {
    if (date && content) {
      const newEntry = {
        id: Date.now().toString(),
        date,
        content
      };
      setScheduleEntries([...scheduleEntries, newEntry]);
      setContent('');
    }
  };

  const handleEditEntry = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
    setDate(entry.date);
    setContent(entry.content);
  };

  const handleUpdateEntry = () => {
    if (editingEntry && date && content) {
      const updatedEntries = scheduleEntries.map(entry =>
        entry.id === editingEntry.id ? { ...entry, date, content } : entry
      );
      setScheduleEntries(updatedEntries);
      setEditingEntry(null);
      setContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setContent('');
  };

  const handleDeleteEntry = (id: string) => {
    setScheduleEntries(scheduleEntries.filter(entry => entry.id !== id));
    if (editingEntry?.id === id) {
      setEditingEntry(null);
      setContent('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">月単位スケジュール</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>カレンダー</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={ja}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{editingEntry ? 'スケジュール編集' : 'スケジュール入力'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  日付
                </label>
                <Input
                  type="date"
                  id="date"
                  value={date ? format(date, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  内容
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
              {editingEntry ? (
                <div className="flex space-x-2">
                  <Button onClick={handleUpdateEntry}>更新</Button>
                  <Button variant="outline" onClick={handleCancelEdit}>キャンセル</Button>
                </div>
              ) : (
                <Button onClick={handleAddEntry}>追加</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>スケジュール一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {scheduleEntries.map((entry) => (
              <li key={entry.id} className="border-b pb-2 flex justify-between items-center">
                <span>
                  <strong>{format(entry.date, 'yyyy年MM月dd日', { locale: ja })}</strong>: {entry.content}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditEntry(entry)}>
                    編集
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;