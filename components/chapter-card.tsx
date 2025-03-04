import Link from "next/link"
import Image from "next/image"
import { Calendar, ChevronRight, Volume2 } from "lucide-react"

import { Button } from "@/components/ui/button"

// Function to format date in Russian
const formatDateInRussian = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

export interface ChapterCardProps {
  id: number
  title: string
  date: string
  excerpt: string
  coverImage: string
  hasAudio?: boolean
}

export function ChapterCard({
  id,
  title,
  date,
  excerpt,
  coverImage,
  hasAudio = false
}: ChapterCardProps) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-sm p-4 rounded-lg border border-slate-800 shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4 lg:w-1/5">
          <div className="relative aspect-[3/4] rounded-md overflow-hidden shadow-md">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="md:w-3/4 lg:w-4/5">
          <h2 className="text-xl font-serif text-white mb-2">{title}</h2>
          
          <div className="flex items-center text-sm text-slate-400 mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDateInRussian(date)}</span>
            
            {hasAudio && (
              <div className="flex items-center ml-4 text-blue-400">
                <Volume2 className="h-4 w-4 mr-1" />
                <span>Аудиоверсия</span>
              </div>
            )}
          </div>
          
          <p className="text-slate-300 mb-4 line-clamp-3">{excerpt}</p>
          
          <Button asChild variant="outline" className="border-slate-700 text-slate-300">
            <Link href={`/chapters/${id}`} className="flex items-center">
              Подробнее
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

