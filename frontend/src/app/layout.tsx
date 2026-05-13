import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Класс antialiased делает шрифты тоньше и приятнее */}
      <body className="bg-[#020202] antialiased">
        {children}
      </body>
    </html>
  );
}