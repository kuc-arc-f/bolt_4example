import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setArticles(articles.map(article => 
        article.id === editingId ? { ...article, title, content } : article
      ));
      setEditingId(null);
    } else {
      setArticles([...articles, { id: Date.now(), title, content }]);
    }
    setTitle('');
    setContent('');
  };

  const handleEdit = (article: Article) => {
    setTitle(article.title);
    setContent(article.content);
    setEditingId(article.id);
  };

  const handleDelete = (id: number) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CMS Article Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId !== null ? 'Edit Article' : 'Add New Article'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Tabs defaultValue="edit" className="w-full">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    placeholder="Article Content (Markdown supported)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={10}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit">
                {editingId !== null ? 'Update Article' : 'Add Article'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Article List</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {filteredArticles.map(article => (
                <div key={article.id} className="mb-4 p-4 border rounded">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 mb-2">
                    <ReactMarkdown>
                      {article.content.length > 150
                        ? `${article.content.slice(0, 150)}...`
                        : article.content}
                    </ReactMarkdown>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;