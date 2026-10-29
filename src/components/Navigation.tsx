'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  ShoppingCart, 
  Compass, 
  Award, 
  Sprout, 
  Bell, 
  User 
} from 'lucide-react';
import { useStore } from '../store/useStore';

export function Navigation() {
  const pathname = usePathname();
  const { items } = useStore();

  const pendingReflectionCount = items.filter(
    (i) => i.category === 'reflection' && i.reflectionStatus === 'pending'
  ).length;

  const essentialCount = items.filter(
    (i) => i.category === 'essential' || i.reflectionStatus === 'kept'
  ).length;

  const keptImpulses = items.filter(
    (i) => i.category === 'reflection' && i.reflectionStatus === 'kept'
  ).length;

  const navItems = [
    {
      href: '/chat',
      label: 'Assistente',
      icon: MessageSquare,
      badge: pendingReflectionCount > 0 ? `${pendingReflectionCount}` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      href: '/lista',
      label: 'Mercado',
      icon: ShoppingCart,
      badge: essentialCount > 0 ? `${essentialCount}` : null,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      href: '/reflexao',
      label: 'Reflexão',
      icon: Compass,
      badge: null,
      badgeColor: '',
    },
    {
      href: '/metricas',
      label: 'Incentivo',
      icon: Award,
      badge: keptImpulses > 0 ? '!' : null,
      badgeColor: 'bg-amber-500 text-white',
    },
  ];

  // Dynamic header based on screen
  const getHeader = () => {
    if (pathname === '/chat' || pathname === '/') {
      return (
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight">
              Lista Consciente
            </span>
          </div>

          {items.length > 0 ? (
            <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800">
              {items.length} itens {pendingReflectionCount > 0 && `| ${pendingReflectionCount} Em Análise`}
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Nova Sessão</span>
          )}
        </div>
      );
    }

    if (pathname === '/lista') {
      return (
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
          <h1 className="font-bold text-slate-900 text-base tracking-tight">
            Minha Lista no Mercado
          </h1>
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>
      );
    }

    if (pathname === '/reflexao') {
      return (
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-slate-900 text-base tracking-tight">
              Dicas de Autogestão
            </h1>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60">
            Personalizado
          </span>
        </div>
      );
    }

    if (pathname === '/metricas' || pathname === '/impacto') {
      return (
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">
                Consciência & Foco
              </div>
              <h1 className="font-bold text-slate-900 text-base tracking-tight leading-tight">
                Diagnóstico & Incentivo
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Top Header */}
      {getHeader()}

      {/* Bottom Tab Bar (Fixed mobile style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((tab) => {
            const isActive = pathname === tab.href || (pathname === '/' && tab.href === '/chat');
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-3 min-w-[64px] rounded-xl transition-all relative ${
                  isActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-emerald-700' : 'stroke-[1.8]'}`} />
                  {tab.badge && (
                    <span
                      className={`absolute -top-1 -right-2 text-[9px] font-bold px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center ${tab.badgeColor}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
