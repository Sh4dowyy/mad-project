import Link from "next/link"
import { ArrowLeft, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import RainAnimation from "@/components/rain-animation"

export default function AboutPage() {
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

        <div className="max-w-3xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-serif mb-4 text-white">О проекте</h1>
            <p className="text-lg text-slate-400">Экспериментальный роман на границе сознания</p>
          </header>

          <div className="bg-slate-900/70 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-slate-800 mb-12 shadow-xl">
            <h2 className="text-2xl font-serif mb-6 text-white">Разговор на грани сна</h2>

            <div className="space-y-6 text-slate-300">
              <p>
                <span className="font-semibold text-white">Разговор на грани сна</span> — это литературный проект,
                экспериментальный роман, исследующий границы между сном и реальностью, сознанием и бессознательным.
                История разворачивается в ночных переписках, наполненных дождём, усталостью и тонкой гранью между
                повседневным и тревожным.
              </p>

              <h3 className="text-xl font-serif text-white mt-8">О чём этот роман?</h3>
              <p>
                Главный герой, Макс, ведёт ночную переписку со своим другом Димой. Разговоры начинаются буднично, но
                постепенно атмосфера становится всё более напряжённой. Между строк скользит ощущение надвигающейся
                странности, а город за окном кажется живым, пропитанным дождём и шёпотом невидимых прохожих.
              </p>

              <h3 className="text-xl font-serif text-white mt-8">Темы и мотивы</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Одиночество и бессонница</li>
                <li>Городская тревога</li>
                <li>Грань между реальностью и сном</li>
                <li>Случайные фразы, оборачивающиеся символами</li>
              </ul>

              <h3 className="text-xl font-serif text-white mt-8">Формат и структура</h3>
              <p>
                Роман написан в форме переписки, дополняемой атмосферными описаниями и внутренними монологами героя.
                Язык повествования минималистичный, но насыщенный деталями, создающими эффект присутствия.
              </p>

              <h3 className="text-xl font-serif text-white mt-8">Как участвовать в проекте?</h3>
              <p>
                Если у вас есть идеи, предложения или вы хотите внести вклад в развитие проекта, вы можете создать Issue
                или Pull Request в GitHub репозитории проекта.
              </p>

              <div className="flex justify-center mt-8">
                <Button asChild className="bg-slate-700 hover:bg-slate-600">
                  <Link href="https://github.com/username/conversation-on-edge-of-sleep">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub репозиторий
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-serif mb-6 text-white">Контакты</h2>
            <p className="text-slate-300 mb-6">
              Если у вас есть вопросы или пожелания, вы можете связаться со мной через GitHub или другие доступные
              каналы.
            </p>
            <p className="text-slate-300 italic text-center">
              "Этот роман — эксперимент, попытка передать атмосферу ночи, сна и реальности, которые смешиваются
              воедино."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

