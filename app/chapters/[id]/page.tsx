import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import RainAnimation from "@/components/rain-animation"

// Моковые данные для отдельной главы
const chapterData = {
  id: 1,
  title: "Глава 1: Первое сообщение",
  date: "10 января 2024",
  content: `«Привет, ты не спишь?» — сообщение от Димы пришло в 2:17 ночи. За окном шёл дождь, размывая огни города в акварельные пятна.

Макс посмотрел на экран телефона, щурясь от яркого света. Он не спал уже третью ночь подряд. Город за окном казался чужим, будто декорация к фильму, который он не хотел смотреть.

«Нет, не сплю. Что случилось?» — набрал он в ответ.

Три точки появились и исчезли. Дима что-то печатал, стирал и снова печатал. Макс смотрел на экран, ожидая ответа, который не приходил. Дождь усилился, барабаня по карнизу как чьи-то нетерпеливые пальцы.

«Ничего. Просто не могу уснуть. Слышишь этот дождь?» — наконец пришло сообщение.

Макс подошёл к окну. Улица внизу блестела от воды, отражая редкие фонари и светофоры. Где-то вдалеке мелькнул силуэт одинокого прохожего, который тут же растворился в темноте.

«Слышу. Кажется, будто город тонет» — ответил он.`,
  coverImage: "/placeholder.svg?height=400&width=300",
}

export default function ChapterPage({ params }: { params: { id: string } }) {
  // В реальном приложении здесь будет запрос к API для получения данных главы по ID
  // const chapter = await getChapter(params.id);

  const chapter = chapterData

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
                    src={chapter.coverImage || "/placeholder.svg"}
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

            {/* Навигация между главами (в реальном приложении) */}
            {Number.parseInt(params.id) < 2 && (
              <Button asChild className="bg-slate-700 hover:bg-slate-600">
                <Link href={`/chapters/${Number.parseInt(params.id) + 1}`}>Следующая глава</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

