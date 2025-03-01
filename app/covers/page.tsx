"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Edit, Save, X } from "lucide-react"
import { useEffect, useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import RainAnimation from "@/components/rain-animation"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"

// Define a type for the cover objects
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

export default function CoversPage() {
  const [covers, setCovers] = useState<Cover[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCover, setNewCover] = useState<Omit<Cover, 'id'>>({ title: '', designer: '', image: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCoverId, setEditingCoverId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Cover | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Fetch covers
      const { data, error } = await supabase.from('covers').select('*');
      if (error) console.error('Error fetching covers:', error);
      console.log('Fetched covers:', data);
      setCovers(data || []);
      
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      console.log('Auth user:', authUser);
      
      if (authUser) {
        // Fetch user role from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single();
        
        console.log('User data from DB:', userData);
        console.log('User error:', userError);
        
        if (!userError && userData) {
          setUser({ id: authUser.id, role: userData.role });
          setIsAdmin(userData.role === 'admin');
          console.log('Is user admin?', userData.role === 'admin');
        } else {
          console.log('User role not found or error occurred');
          // Even if we couldn't get the role, we know the user is authenticated
          setUser({ id: authUser.id, role: '' });
        }
      } else {
        console.log('No authenticated user found');
        setUser(null);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('covers')
        .upload(`/${fileName}`, file);
      
      if (error) {
        if (error.message.includes('row-level security policy')) {
          console.error('Permission denied: You need to configure storage permissions in Supabase');
          alert('Ошибка загрузки: Необходимо настроить права доступа в Supabase. Пожалуйста, обратитесь к администратору.');
        } else {
          console.error('Error uploading file:', error);
          alert(`Ошибка загрузки: ${error.message}`);
        }
        throw error;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('covers')
        .getPublicUrl(`/${fileName}`);
      
      if (editingCoverId) {
        setEditFormData(prev => prev ? { ...prev, image: urlData.publicUrl } : null);
      } else {
        setNewCover({ ...newCover, image: urlData.publicUrl });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCover = async () => {
    // Check if user is authenticated before allowing add operation
    if (!user) {
      alert('Вы должны войти в систему, чтобы добавлять обложки');
      return;
    }
    
    const supabase = createClient();
    const { data, error } = await supabase.from('covers').insert([{ ...newCover }]);
    if (error) console.error('Error adding cover:', error);
    else if (data) {
      setCovers([...covers, data[0]]);
      setIsFormVisible(false);
      // Reset form
      setNewCover({ title: '', designer: '', image: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEditCover = (cover: Cover) => {
    setEditingCoverId(cover.id);
    setEditFormData(cover);
    // Hide the add form if it's open
    setIsFormVisible(false);
  };

  const handleCancelEdit = () => {
    setEditingCoverId(null);
    setEditFormData(null);
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !user) return;
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('covers')
      .update({
        title: editFormData.title,
        designer: editFormData.designer,
        image: editFormData.image
      })
      .eq('id', editingCoverId);
    
    if (error) {
      console.error('Error updating cover:', error);
      alert(`Ошибка при обновлении обложки: ${error.message}`);
    } else {
      // Refresh covers list
      const { data: coversData } = await supabase.from('covers').select('*');
      setCovers(coversData || []);
      
      // Reset edit state
      setEditingCoverId(null);
      setEditFormData(null);
    }
  };

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
          <h1 className="text-3xl md:text-5xl font-serif mb-4 text-white">Обложки</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Визуальные интерпретации романа через различные варианты обложек
          </p>
        </header>

        <div className="max-w-6xl mx-auto mb-12">
          {user && !editingCoverId && (
            <Button className="bg-slate-700 hover:bg-slate-600 mb-8" onClick={() => setIsFormVisible(!isFormVisible)}>
              <Plus className="mr-2 h-4 w-4" />
              {isFormVisible ? 'Скрыть форму' : 'Добавить новую обложку'}
            </Button>
          )}

          {isFormVisible && user && !editingCoverId && (
            <div className="mb-8 p-4 bg-slate-800 rounded-md">
              <Input placeholder="Название" value={newCover.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCover({ ...newCover, title: e.target.value })} className="mb-2" />
              <Input placeholder="Дизайнер" value={newCover.designer} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCover({ ...newCover, designer: e.target.value })} className="mb-2" />
              
              <div className="mb-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  ref={fileInputRef}
                  className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-slate-700 file:text-slate-300
                    hover:file:bg-slate-600"
                />
                {isUploading && <p className="text-sm text-slate-400 mt-1">Загрузка...</p>}
                {newCover.image && (
                  <div className="mt-2">
                    <p className="text-sm text-slate-400">Предпросмотр:</p>
                    <div className="relative h-32 w-24 mt-1 overflow-hidden rounded-md">
                      <img src={newCover.image} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white" 
                onClick={handleAddCover}
                disabled={!newCover.title || !newCover.designer || !newCover.image || isUploading}
              >
                Добавить
              </Button>
            </div>
          )}

          {/* Edit Form */}
          {editingCoverId && editFormData && user && (
            <div className="mb-8 p-4 bg-slate-800 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Редактирование обложки</h3>
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
                placeholder="Название" 
                value={editFormData.title} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFormData({ ...editFormData, title: e.target.value })} 
                className="mb-2" 
              />
              <Input 
                placeholder="Дизайнер" 
                value={editFormData.designer} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFormData({ ...editFormData, designer: e.target.value })} 
                className="mb-2" 
              />
              
              <div className="mb-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-slate-700 file:text-slate-300
                    hover:file:bg-slate-600"
                />
                {isUploading && <p className="text-sm text-slate-400 mt-1">Загрузка...</p>}
                {editFormData.image && (
                  <div className="mt-2">
                    <p className="text-sm text-slate-400">Текущее изображение:</p>
                    <div className="relative h-32 w-24 mt-1 overflow-hidden rounded-md">
                      <img src={editFormData.image} alt="Cover" className="object-cover w-full h-full" />
                    </div>
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
                  disabled={!editFormData.title || !editFormData.designer || !editFormData.image || isUploading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить изменения
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {covers.map((cover) => (
              <Card
                key={cover.id}
                className="bg-slate-900/70 backdrop-blur-sm border-slate-800 shadow-lg overflow-hidden relative"
              >
                {user && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                    onClick={() => handleEditCover(cover)}
                  >
                    <Edit size={16} />
                  </Button>
                )}
                <CardContent className="p-4">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-md">
                    <Image
                      src={cover.image || "/placeholder.svg"}
                      alt={cover.title}
                      fill
                      className="object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-serif text-white mb-1">{cover.title}</h3>
                  <p className="text-sm text-slate-400">Дизайнер: {cover.designer}</p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0">
                  <Button asChild variant="outline" className="w-full border-slate-700 text-slate-300">
                    <Link href={`/covers/${cover.id}`}>Подробнее</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

