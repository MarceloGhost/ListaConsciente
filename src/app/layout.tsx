import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navigation } from '../components/Navigation';

export const metadata: Metadata = {
  title: 'Lista Consciente - Compras Simples e Sem Distrações',
  description: 'Aplicativo minimalista para compras conscientes, redução de sobrecarga mental e gestão financeira no supermercado.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-100/70 text-[#1A1C1E] min-h-screen flex justify-center font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <div className="w-full max-w-md min-h-screen bg-[#fafbfc] flex flex-col shadow-sm border-x border-slate-200/80 relative pb-24">
          <Navigation />
          <main className="flex-1 px-4 py-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
