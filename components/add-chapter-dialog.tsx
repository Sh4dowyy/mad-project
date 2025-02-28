"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// Импортируем моковые данные обложек (в реальном приложении это будет из API)
const availableCovers = [
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
  {
    id: 4,
    title: "Дождливая ночь",
    designer: "Сергей П.",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export function AddChapterDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCoverId, setSelectedCoverId] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Проверяем, что обложка выбрана
    if (!selectedCoverId) {
      alert("Пожалуйста, выберите обложку для главы")
      return
    }

    // Здесь будет логика сохранения главы с выбранной обложкой
    console.log({
      title,
      content,
      coverId: selectedCoverId,
    })

    // Сбрасываем форму и закрываем диалог
    setTitle("")
    setContent("")
    setSelectedCoverId(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-700 hover:bg-slate-600">Добавить новую главу</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-black/90 border-red-900/30 red-border-glow">
        <DialogHeader>
          <DialogTitle className="text-red-50 font-serif text-2xl red-glow">Добавить новую главу</DialogTitle>
          <DialogDescription className="text-red-200/70">
            Заполните информацию о главе и выберите подходящую обложку
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-slate-300">
                  Название главы
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите название главы"
                  className="bg-black/60 border-red-900/30 text-red-100"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-slate-300">
                  Содержание
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Введите текст главы..."
                  className="min-h-[200px] bg-black/60 border-red-900/30 text-red-100"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-slate-300">Выберите обложку для главы</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  {availableCovers.map((cover) => (
                    <div
                      key={cover.id}
                      className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                        selectedCoverId === cover.id
                          ? "border-blue-500 shadow-lg shadow-blue-500/20"
                          : "border-transparent hover:border-slate-700"
                      }`}
                      onClick={() => setSelectedCoverId(cover.id)}
                    >
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={cover.image || "/placeholder.svg"}
                          alt={cover.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {selectedCoverId === cover.id && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="bg-blue-500 text-white rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-center py-1 bg-slate-800 text-slate-300 truncate px-1">
                        {cover.title}
                      </div>
                    </div>
                  ))}
                </div>
                {!selectedCoverId && <p className="text-amber-500 text-sm mt-1">* Обязательно выберите обложку</p>}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-slate-700 hover:bg-slate-600"
              disabled={!title || !content || !selectedCoverId}
            >
              Сохранить главу
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

