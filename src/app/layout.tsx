import type { Metadata } from 'next'
import { Geist, Geist_Mono, Pacifico } from 'next/font/google'
import './globals.css'

const pacifico = Pacifico({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-pacifico',
})

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'TripleAI',
    description: 'AI 기반 여행 계획 플랫폼',
    icons: {
        icon: 'https://cdn-icons-png.flaticon.com/512/25/25613.png',
        shortcut: 'https://cdn-icons-png.flaticon.com/512/25/25613.png',
        apple: 'https://cdn-icons-png.flaticon.com/512/25/25613.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}
