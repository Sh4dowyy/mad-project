import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import RainAnimation from "@/components/rain-animation"
import { AddChapterDialog } from "@/components/add-chapter-dialog"
import { ChapterCard } from "@/components/chapter-card"

// Mock data for chapters
const chapters = [
  {
    id: 1,
    title: "Глава 1: Первое сообщение",
    date: "10 января 2024",
    excerpt:
      "«Привет, ты не спишь?» — сообщение от Димы пришло в 2:17 ночи. За окном шёл дождь, размывая огни города в акварельные пятна.",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    title: "Глава 2: Эхо тишины",
    date: "15 января 2024",
    excerpt:
      "Макс смотрел на экран телефона. Три точки появлялись и исчезали уже минуту. Дима что-то печатал, стирал и снова печатал.",
    coverImage: "/placeholder.svg?height=400&width=300",
  },
]

export default function ChaptersPage() {
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
            <AddChapterDialog />
          </div>

          <div className="space-y-6">
            {chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                id={chapter.id}
                title={chapter.title}
                date={chapter.date}
                excerpt={chapter.excerpt}
                coverImage={chapter.coverImage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

