import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookmarkPlus, Pencil, Trash2, Search } from 'lucide-react';

interface Bookmark {
  id: number;
  title: string;
  url: string;
}

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addBookmark = () => {
    if (title && url) {
      if (editingId !== null) {
        setBookmarks(bookmarks.map(bookmark => 
          bookmark.id === editingId ? { ...bookmark, title, url } : bookmark
        ));
        setEditingId(null);
      } else {
        setBookmarks([...bookmarks, { id: Date.now(), title, url }]);
      }
      setTitle('');
      setUrl('');
    }
  };

  const editBookmark = (id: number) => {
    const bookmarkToEdit = bookmarks.find(bookmark => bookmark.id === id);
    if (bookmarkToEdit) {
      setTitle(bookmarkToEdit.title);
      setUrl(bookmarkToEdit.url);
      setEditingId(id);
    }
  };

  const deleteBookmark = (id: number) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => 
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookmarks, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bookmark App</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingId !== null ? 'Edit Bookmark' : 'Add New Bookmark'}</CardTitle>
          <CardDescription>Enter the details of the bookmark you want to save.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addBookmark}>
            {editingId !== null ? (
              <>
                <Pencil className="mr-2 h-4 w-4" /> Update Bookmark
              </>
            ) : (
              <>
                <BookmarkPlus className="mr-2 h-4 w-4" /> Add Bookmark
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <div className="mb-6">
        <Input
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          icon={<Search className="h-4 w-4" />}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookmarks.map((bookmark) => (
          <Card key={bookmark.id}>
            <CardHeader>
              <CardTitle>{bookmark.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {bookmark.url}
              </a>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="icon" onClick={() => editBookmark(bookmark.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteBookmark(bookmark.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;