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
  openGraph: {
    images: [
      "https://scontent-arn2-1.xx.fbcdn.net/v/t1.15752-9/477072929_625471866734505_5231902385237446960_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=0024fc&_nc_ohc=c5Fuvu0k4IUQ7kNvgHRzZPB&_nc_oc=AdgVYIySm7nT6LRw_SyXTlx2HNaXGmV0dxWwkjUTd7O4uDQRAz6oe9RUnT1HuJS1SKk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-arn2-1.xx&oh=03_Q7cD1gEQwJA6pRolCkhoY0mHLEJIVJZ8IE-dtt6IM9daSrGgxg&oe=67EC0774"
    ]
  }
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

