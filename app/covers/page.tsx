import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import RainAnimation from "@/components/rain-animation"

// Mock data for covers
const covers = [
  {
    id: 1,
    title: "Ночной город",
    designer: "Анна К.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    title: "Размытая реальность",
    designer: "Михаил Л.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    title: "Грань сознания",
    designer: "Елена В.",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export default function CoversPage() {
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
          <Button className="bg-slate-700 hover:bg-slate-600 mb-8">
            <Plus className="mr-2 h-4 w-4" />
            Добавить новую обложку
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {covers.map((cover) => (
              <Card
                key={cover.id}
                className="bg-slate-900/70 backdrop-blur-sm border-slate-800 shadow-lg overflow-hidden"
              >
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

