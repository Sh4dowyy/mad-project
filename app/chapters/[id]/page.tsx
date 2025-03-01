"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import RainAnimation from "@/components/rain-animation"
import { createClient } from "@/utils/supabase/client"

// Define types for chapter and cover
interface Chapter {
  id: number;
  title: string;
  date: string;
  content: string;
  cover_id: number;
}

interface Cover {
  id: number;
  title: string;
  designer: string;
  image: string;
}

export default function ChapterPage() {
  const params = useParams();
  const chapterId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [coverImage, setCoverImage] = useState<string>("/placeholder.svg?height=400&width=300");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalChapters, setTotalChapters] = useState(0);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!chapterId) return;
      
      setLoading(true);
      try {
        const supabase = createClient();
        
        // Fetch chapter data
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', chapterId)
          .single();
        
        if (chapterError) throw chapterError;
        if (!chapterData) throw new Error('Chapter not found');
        
        setChapter(chapterData);
        
        // Fetch cover image
        if (chapterData.cover_id) {
          const { data: coverData, error: coverError } = await supabase
            .from('covers')
            .select('image')
            .eq('id', chapterData.cover_id)
            .single();
          
          if (!coverError && coverData) {
            setCoverImage(coverData.image);
          }
        }

        // Get total number of chapters
        const { count } = await supabase
          .from('chapters')
          .select('*', { count: 'exact', head: true });
        
        setTotalChapters(count || 0);
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chapter');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 flex items-center justify-center">
        <RainAnimation />
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 flex flex-col items-center justify-center">
        <RainAnimation />
        <div className="text-xl mb-4">Ошибка: {error || 'Глава не найдена'}</div>
        <Button asChild variant="outline" className="border-slate-700 text-slate-300">
          <Link href="/chapters">Вернуться к списку глав</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 overflow-hidden">
      <RainAnimation />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-slate-400 hover:text-white">
            <Link href="/chapters">
              <ArrowLeft className="mr-2 h-4 w-4" />К списку глав
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/70 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-slate-800 mb-12 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="md:w-1/3 lg:w-1/4">
                <div className="relative aspect-[3/4] rounded-md overflow-hidden shadow-lg">
                  <Image
                    src={coverImage}
                    alt={chapter.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 lg:w-3/4">
                <h1 className="text-2xl md:text-4xl font-serif mb-4 text-white">{chapter.title}</h1>
                <p className="text-slate-400 mb-6">{chapter.date}</p>
              </div>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              {chapter.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-6 text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button asChild variant="outline" className="border-slate-700 text-slate-300">
              <Link href="/chapters">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к списку
              </Link>
            </Button>

            {/* Navigation between chapters */}
            {Number.parseInt(chapterId) < totalChapters && (
              <Button asChild className="bg-slate-700 hover:bg-slate-600">
                <Link href={`/chapters/${Number.parseInt(chapterId) + 1}`}>Следующая глава</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

