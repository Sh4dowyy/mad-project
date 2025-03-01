"use client"

import Link from "next/link"
import { ArrowLeft, Plus, Edit, Save, X } from "lucide-react"
import { useEffect, useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import RainAnimation from "@/components/rain-animation"
import { ChapterCard } from "@/components/chapter-card"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Define types for chapters and covers
interface Chapter {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
  cover_id: number;
  cover_image?: string;
  audio_url?: string;
}

interface Cover {
  id: number;
  title: string;
  designer: string;
  image: string;
}

// Define a type for user
interface User {
  id: string;
  role: string;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [covers, setCovers] = useState<Cover[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newChapter, setNewChapter] = useState<Omit<Chapter, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    cover_id: 0,
    audio_url: ''
  });
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Chapter | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*');
      
      if (chaptersError) console.error('Error fetching chapters:', chaptersError);
      else setChapters(chaptersData || []);
      
      // Fetch covers
      const { data: coversData, error: coversError } = await supabase
        .from('covers')
        .select('*');
      
      if (coversError) console.error('Error fetching covers:', coversError);
      else setCovers(coversData || []);
      
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      console.log('Auth user in chapters page:', authUser);
      
      if (authUser) {
        // Fetch user role from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single();
        
        console.log('User data from DB in chapters page:', userData);
        console.log('User error in chapters page:', userError);
        
        if (!userError && userData) {
          setUser({ id: authUser.id, role: userData.role });
          setIsAdmin(userData.role === 'admin');
          console.log('Is user admin in chapters page?', userData.role === 'admin');
        } else {
          console.log('User role not found or error occurred in chapters page');
          // Even if we couldn't get the role, we know the user is authenticated
          setUser({ id: authUser.id, role: '' });
        }
      } else {
        console.log('No authenticated user found in chapters page');
        setUser(null);
      }
    };

    fetchData();
  }, []);

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('audio')
        .upload(`/${fileName}`, file);
      
      if (error) {
        if (error.message.includes('row-level security policy')) {
          console.error('Permission denied: You need to configure storage permissions in Supabase');
          alert('Ошибка загрузки: Необходимо настроить права доступа в Supabase. Пожалуйста, обратитесь к администратору.');
        } else {
          console.error('Error uploading audio file:', error);
          alert(`Ошибка загрузки: ${error.message}`);
        }
        throw error;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('audio')
        .getPublicUrl(`/${fileName}`);
      
      if (editingChapterId) {
        setEditFormData(prev => prev ? { ...prev, audio_url: urlData.publicUrl } : null);
      } else {
        setNewChapter({ ...newChapter, audio_url: urlData.publicUrl });
      }
    } catch (error) {
      console.error('Error uploading audio file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddChapter = async () => {
    // Check if user is authenticated before allowing add operation
    if (!user) {
      alert('Вы должны войти в систему, чтобы добавлять главы');
      return;
    }
    
    const supabase = createClient();
    
    // Get the selected cover's image URL
    const selectedCover = covers.find(cover => cover.id === newChapter.cover_id);
    
    const { data, error } = await supabase
      .from('chapters')
      .insert([{ 
        ...newChapter,
        date: newChapter.date || new Date().toISOString().split('T')[0]
      }]);
    
    if (error) {
      console.error('Error adding chapter:', error);
      alert(`Ошибка при добавлении главы: ${error.message}`);
    } else {
      // Refresh chapters list
      const { data: chaptersData } = await supabase.from('chapters').select('*');
      setChapters(chaptersData || []);
      
      // Reset form
      setNewChapter({
        title: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        content: '',
        cover_id: 0,
        audio_url: ''
      });
      if (audioInputRef.current) audioInputRef.current.value = '';
      setIsFormVisible(false);
    }
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditFormData(chapter);
    // Hide the add form if it's open
    setIsFormVisible(false);
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setEditFormData(null);
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !user) return;
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('chapters')
      .update({
        title: editFormData.title,
        date: editFormData.date,
        excerpt: editFormData.excerpt,
        content: editFormData.content,
        cover_id: editFormData.cover_id,
        audio_url: editFormData.audio_url
      })
      .eq('id', editingChapterId);
    
    if (error) {
      console.error('Error updating chapter:', error);
      alert(`Ошибка при обновлении главы: ${error.message}`);
    } else {
      // Refresh chapters list
      const { data: chaptersData } = await supabase.from('chapters').select('*');
      setChapters(chaptersData || []);
      
      // Reset edit state
      setEditingChapterId(null);
      setEditFormData(null);
    }
  };

  // Find cover image URL for each chapter
  const chaptersWithCovers = chapters.map(chapter => {
    const cover = covers.find(c => c.id === chapter.cover_id);
    return {
      ...chapter,
      cover_image: cover?.image || "/placeholder.svg?height=400&width=300"
    };
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 overflow-hidden">
      <RainAnimation />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-slate-400 hover:text-white">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              На главную
            </Link>
          </Button>
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-serif mb-4 text-white">Главы</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Погрузитесь в ночные разговоры на грани сна и реальности
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="mb-8">
            {user && !editingChapterId && (
              <Button 
                className="bg-slate-700 hover:bg-slate-600 mb-8" 
                onClick={() => setIsFormVisible(!isFormVisible)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isFormVisible ? 'Скрыть форму' : 'Добавить новую главу'}
              </Button>
            )}

            {isFormVisible && user && !editingChapterId && (
              <div className="mb-8 p-4 bg-slate-800 rounded-md">
                <Input 
                  placeholder="Название главы" 
                  value={newChapter.title} 
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })} 
                  className="mb-2" 
                />
                
                <Input 
                  type="date" 
                  value={newChapter.date} 
                  onChange={(e) => setNewChapter({ ...newChapter, date: e.target.value })} 
                  className="mb-2" 
                />
                
                <Textarea 
                  placeholder="Краткое описание" 
                  value={newChapter.excerpt} 
                  onChange={(e) => setNewChapter({ ...newChapter, excerpt: e.target.value })} 
                  className="mb-2" 
                />
                
                <Textarea 
                  placeholder="Полный текст главы" 
                  value={newChapter.content} 
                  onChange={(e) => setNewChapter({ ...newChapter, content: e.target.value })} 
                  className="mb-2 min-h-[200px]" 
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Выберите обложку
                  </label>
                  <select 
                    value={newChapter.cover_id}
                    onChange={(e) => setNewChapter({ ...newChapter, cover_id: parseInt(e.target.value) })}
                    className="w-full p-2 rounded-md bg-slate-700 text-slate-200 border border-slate-600"
                  >
                    <option value="0">Выберите обложку</option>
                    {covers.map((cover) => (
                      <option key={cover.id} value={cover.id}>
                        {cover.title} (Дизайнер: {cover.designer})
                      </option>
                    ))}
                  </select>
                  
                  {newChapter.cover_id > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-400">Выбранная обложка:</p>
                      <div className="relative h-32 w-24 mt-1 overflow-hidden rounded-md">
                        <img 
                          src={covers.find(c => c.id === newChapter.cover_id)?.image || ""} 
                          alt="Selected cover" 
                          className="object-cover w-full h-full" 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Audio file upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Аудиоверсия главы (опционально)
                  </label>
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleAudioChange} 
                    ref={audioInputRef}
                    className="block w-full text-sm text-slate-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-slate-700 file:text-slate-300
                      hover:file:bg-slate-600"
                  />
                  {isUploading && <p className="text-sm text-slate-400 mt-1">Загрузка аудио...</p>}
                  {newChapter.audio_url && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-400">Аудиофайл загружен</p>
                      <audio 
                        controls 
                        className="mt-1 w-full" 
                        src={newChapter.audio_url}
                      />
                    </div>
                  )}
                </div>
                
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white" 
                  onClick={handleAddChapter}
                  disabled={!newChapter.title || !newChapter.excerpt || !newChapter.content || !newChapter.cover_id || isUploading}
                >
                  Добавить главу
                </Button>
              </div>
            )}

            {/* Edit Form */}
            {editingChapterId && editFormData && user && (
              <div className="mb-8 p-4 bg-slate-800 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Редактирование главы</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-white"
                    onClick={handleCancelEdit}
                  >
                    <X size={20} />
                  </Button>
                </div>
                
                <Input 
                  placeholder="Название главы" 
                  value={editFormData.title} 
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} 
                  className="mb-2" 
                />
                
                <Input 
                  type="date" 
                  value={editFormData.date} 
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })} 
                  className="mb-2" 
                />
                
                <Textarea 
                  placeholder="Краткое описание" 
                  value={editFormData.excerpt} 
                  onChange={(e) => setEditFormData({ ...editFormData, excerpt: e.target.value })} 
                  className="mb-2" 
                />
                
                <Textarea 
                  placeholder="Полный текст главы" 
                  value={editFormData.content || ''} 
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })} 
                  className="mb-2 min-h-[200px]" 
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Выберите обложку
                  </label>
                  <select 
                    value={editFormData.cover_id}
                    onChange={(e) => setEditFormData({ ...editFormData, cover_id: parseInt(e.target.value) })}
                    className="w-full p-2 rounded-md bg-slate-700 text-slate-200 border border-slate-600"
                  >
                    <option value="0">Выберите обложку</option>
                    {covers.map((cover) => (
                      <option key={cover.id} value={cover.id}>
                        {cover.title} (Дизайнер: {cover.designer})
                      </option>
                    ))}
                  </select>
                  
                  {editFormData.cover_id > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-400">Выбранная обложка:</p>
                      <div className="relative h-32 w-24 mt-1 overflow-hidden rounded-md">
                        <img 
                          src={covers.find(c => c.id === editFormData.cover_id)?.image || ""} 
                          alt="Selected cover" 
                          className="object-cover w-full h-full" 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Audio file upload for edit form */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Аудиоверсия главы (опционально)
                  </label>
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleAudioChange}
                    className="block w-full text-sm text-slate-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-slate-700 file:text-slate-300
                      hover:file:bg-slate-600"
                  />
                  {isUploading && <p className="text-sm text-slate-400 mt-1">Загрузка аудио...</p>}
                  {editFormData.audio_url && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-400">Аудиофайл загружен</p>
                      <audio 
                        controls 
                        className="mt-1 w-full" 
                        src={editFormData.audio_url}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    className="border-slate-700 text-slate-300"
                    onClick={handleCancelEdit}
                  >
                    Отмена
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    onClick={handleSaveEdit}
                    disabled={!editFormData.title || !editFormData.excerpt || !editFormData.content || !editFormData.cover_id || isUploading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить изменения
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {chaptersWithCovers.map((chapter) => (
              <div key={chapter.id} className="relative">
                {user && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                    onClick={() => handleEditChapter(chapter)}
                  >
                    <Edit size={16} />
                  </Button>
                )}
                <ChapterCard
                  id={chapter.id}
                  title={chapter.title}
                  date={chapter.date}
                  excerpt={chapter.excerpt}
                  coverImage={chapter.cover_image}
                  hasAudio={!!chapter.audio_url}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

