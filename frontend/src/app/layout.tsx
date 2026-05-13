import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

// Основной шрифт — современный и чистый
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// Шрифт для цифр и тех-данных — хакерский/моноширинный
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-[#020202] text-zinc-200 antialiased font-sans">
        {/* Сетка и виньетка */}
        <div className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020202_85%)] pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}