"use client"

import { useEffect, useRef } from "react"

export default function RainAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener("resize", resizeCanvas)

    // Создаем градиент для капель
    const createDropGradient = (ctx: CanvasRenderingContext2D, x: number, y: number, length: number) => {
      const gradient = ctx.createLinearGradient(x, y, x, y + length)
      gradient.addColorStop(0, "rgba(255, 0, 0, 0)")
      gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.2)")
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)")
      return gradient
    }

    // Свойства капель
    const raindrops: {
      x: number
      y: number
      length: number
      speed: number
      opacity: number
      width: number
    }[] = []

    const createRaindrop = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -100,
        length: Math.random() * 50 + 20, // Увеличили длину капель
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.1,
        width: Math.random() * 2 + 0.5, // Добавили разную ширину капель
      }
    }

    // Инициализация капель
    for (let i = 0; i < 100; i++) {
      raindrops.push(createRaindrop())
    }

    const drawRain = () => {
      if (!ctx || !canvas) return

      // Создаем эффект размытия предыдущего кадра
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      raindrops.forEach((drop, index) => {
        ctx.beginPath()
        const gradient = createDropGradient(ctx, drop.x, drop.y, drop.length)
        ctx.strokeStyle = gradient
        ctx.lineWidth = drop.width
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.stroke()

        // Добавляем свечение
        ctx.shadowColor = "rgba(255, 0, 0, 0.2)"
        ctx.shadowBlur = 5
        ctx.stroke()
        ctx.shadowBlur = 0

        drop.y += drop.speed

        // Сброс капли при выходе за экран
        if (drop.y > canvas.height) {
          raindrops[index] = createRaindrop()
        }
      })

      requestAnimationFrame(drawRain)
    }

    drawRain()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ opacity: 0.8 }} />
  )
}

