"use client"

import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { useEffect, useState } from "react"

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
}

interface Cover {
  id: number;
  title: string;
  designer: string;
  image: string;
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
    cover_id: 0
  });

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
    };

    fetchData();
  }, []);

  const handleAddChapter = async () => {
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
        cover_id: 0
      });
      setIsFormVisible(false);
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
            <Button 
              className="bg-slate-700 hover:bg-slate-600 mb-8" 
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isFormVisible ? 'Скрыть форму' : 'Добавить новую главу'}
            </Button>

            {isFormVisible && (
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
                
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white" 
                  onClick={handleAddChapter}
                  disabled={!newChapter.title || !newChapter.excerpt || !newChapter.content || !newChapter.cover_id}
                >
                  Добавить главу
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {chaptersWithCovers.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                id={chapter.id}
                title={chapter.title}
                date={chapter.date}
                excerpt={chapter.excerpt}
                coverImage={chapter.cover_image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

