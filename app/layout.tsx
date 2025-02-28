import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Разговор на грани сна | Экспериментальный роман",
  description: "Литературный проект, исследующий границы между сном и реальностью, сознанием и бессознательным.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>{children}</body>
    </html>
  )
}

