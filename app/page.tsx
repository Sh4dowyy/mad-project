import Link from "next/link"
import { ChevronRight, BookOpen, ImageIcon, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import RainAnimation from "@/components/rain-animation"
import AuthButton from "@/components/header-auth"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black text-red-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />
      <RainAnimation />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex justify-end mb-8">
          <AuthButton />
        </div>
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-serif mb-4 text-red-50 red-glow">Разговор на грани сна</h1>
          <p className="text-xl md:text-2xl text-red-200/80 max-w-2xl mx-auto font-light italic">
            Экспериментальный роман на границе сознания и бессознательного
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-red-900/30 mb-12 shadow-xl red-border-glow">
            <h2 className="text-2xl md:text-3xl mb-4 font-serif text-red-50 red-glow">О проекте</h2>
            <p className="mb-4 text-red-100/90">
              Разговор на грани сна — это литературный проект, исследующий границы между сном и реальностью, сознанием и
              бессознательным. История разворачивается в ночных переписках, наполненных тревожным мерцанием экрана и
              шепотом невидимых собеседников.
            </p>
            <p className="mb-6 text-red-100/90">
              Главный герой, Макс, ведёт ночную переписку со своим другом Димой. Разговоры начинаются буднично, но
              постепенно реальность искажается, а город за окном превращается в лабиринт красных теней и загадочных
              отражений.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-red-950/80 hover:bg-red-900/80 border border-red-800/50 red-border-glow">
                <Link href="/chapters">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Читать главы
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-red-900/50 text-red-100 hover:bg-red-950/30 red-border-glow"
              >
                <Link href="/about">
                  Узнать больше
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-red-900/30 shadow-lg red-border-glow">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 mr-3 text-red-500/70" />
                <h3 className="text-xl font-serif text-red-50 red-glow">Главы</h3>
              </div>
              <p className="text-red-100/90 mb-4">
                Погрузитесь в атмосферу ночных разговоров и размытой реальности. Новые главы добавляются регулярно.
              </p>
              <Button asChild variant="link" className="text-red-400 hover:text-red-300 p-0">
                <Link href="/chapters">
                  Перейти к главам
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-red-900/30 shadow-lg red-border-glow">
              <div className="flex items-center mb-4">
                <ImageIcon className="h-6 w-6 mr-3 text-red-500/70" />
                <h3 className="text-xl font-serif text-red-50 red-glow">Обложки</h3>
              </div>
              <p className="text-red-100/90 mb-4">
                Исследуйте визуальные интерпретации романа через различные варианты обложек.
              </p>
              <Button asChild variant="link" className="text-red-400 hover:text-red-300 p-0">
                <Link href="/covers">
                  Смотреть обложки
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </main>

        <footer className="mt-24 text-center text-red-400/60">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="icon" className="text-red-400/60 hover:text-red-300">
              <Link href="https://github.com/username/conversation-on-edge-of-sleep">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Разговор на грани сна</p>
        </footer>
      </div>
    </div>
  )
}

