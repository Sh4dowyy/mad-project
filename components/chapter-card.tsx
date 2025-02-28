import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ChapterCardProps {
  id: number
  title: string
  date: string
  excerpt: string
  coverImage: string
}

export function ChapterCard({ id, title, date, excerpt, coverImage }: ChapterCardProps) {
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-red-900/30 shadow-lg overflow-hidden red-border-glow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 relative">
          <div className="relative aspect-[3/4] md:h-full">
            <Image src={coverImage || "/placeholder.svg"} alt={title} fill className="object-cover opacity-90" />
          </div>
        </div>
        <div className="md:w-3/4 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-serif text-red-50 red-glow">{title}</CardTitle>
            <p className="text-sm text-red-300/70">{date}</p>
          </CardHeader>
          <CardContent>
            <p className="text-red-100/90">{excerpt}</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button
              asChild
              variant="outline"
              className="border-red-900/50 text-red-100 hover:bg-red-950/30 red-border-glow"
            >
              <Link href={`/chapters/${id}`}>Читать полностью</Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

