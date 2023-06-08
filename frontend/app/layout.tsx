'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

interface Props {
  session: Session | null
  children: React.ReactNode
}

const RootLayout: React.FC <Props> = ({ children, session } ) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

export default RootLayout