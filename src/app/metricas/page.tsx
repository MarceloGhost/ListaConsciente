'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  ShoppingBag, 
  Sparkles, 
  Receipt,
  Flame,
  Award
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function IncentivoPage() {
  const { 
    items, 
    postponeItem, 
    resetAll, 
    loadSampleData 
  } = useStore();

  const keptImpulses = items.filter((i) => i.category === 'reflection' && i.reflectionStatus === 'kept');
  const postponedImpulses = items.filter((i) => i.reflectionStatus === 'postponed');

  // Items actually being purchased
  const purchasedItems = items.filter(
    (i) => i.category === 'essential' || i.reflectionStatus === 'kept'
  );

  const totalSpent = purchasedItems.reduce((acc, i) => acc + i.price, 0);
  const totalSaved = postponedImpulses.reduce((acc, i) => acc + i.price, 0);
  const unpricedPurchasedCount = purchasedItems.filter((i) => i.price === 0).length;

  const hasPersistentImpulse = keptImpulses.length > 0;
  const hasSuccessfulPostponement = postponedImpulses.length > 0;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-150 text-slate-400 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800">Sem dados para diagnóstico</h2>
          <p className="text-xs text-slate-500 max-w-xs">
            Comece inserindo seus produtos no Assistente ou teste com a lista de exemplo.
          </p>
        </div>
        <button
          onClick={() => loadSampleData()}
          className="py-2.5 px-5 rounded-2xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Carregar lista de teste
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* 1. SEÇÃO DE ALERTA OU INCENTIVO AO USUÁRIO */}
      {hasPersistentImpulse ? (
        /* ALERTA: Usuário insistiu em comprar itens não necessários */
        <section className="bg-amber-500/10 border-2 border-amber-500/80 rounded-3xl p-5 space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                Alerta de Consumo por Impulso
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Atenção: Você insistiu em manter itens não essenciais!
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Identificamos que você optou por levar{' '}
            <strong>{keptImpulses.map((i) => `"${i.name}"`).join(', ')}</strong>
            {keptImpulses.some((i) => i.price > 0) ? (
              <>
                , somando{' '}
                <strong className="text-amber-900">
                  R$ {keptImpulses.reduce((acc, i) => acc + i.price, 0).toFixed(2).replace('.', ',')}
                </strong>{' '}
                em gastos supérfluos definidos por você.
              </>
            ) : (
              '.'
            )}
          </p>

          <div className="p-3 bg-white/90 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-2">
            <p className="font-medium italic">
              &ldquo;Antes de passar no caixa, pergunte-se: eu realmente preciso disso hoje, ou estou comprando apenas pelo estímulo da prateleira?&rdquo;
            </p>

            <div className="pt-1 flex flex-col gap-2">
              {keptImpulses.map((item) => (
                <button
                  key={item.id}
                  onClick={() => postponeItem(item.id)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ainda dá tempo: Adiar &ldquo;{item.name}&rdquo; agora</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* INCENTIVO & ELOGIO: Usuário manteve foco 100% essencial ou adiou com sabedoria */
        <section className="bg-emerald-700 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-200" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Incentivo ao Consumo Consciente
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold tracking-tight">
              Parabéns pelo excelente foco!
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed font-medium">
              {hasSuccessfulPostponement
                ? `Você teve maturidade para adiar compras supérfluas${
                    totalSaved > 0 ? ` e preservou R$ ${totalSaved.toFixed(2).replace('.', ',')}` : ''
                  }. Seu bolso e seu bem-estar agradecem!`
                : 'Sua lista foi montada estritamente com necessidades reais. Você passou longe de armadilhas de marketing no mercado.'}
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-600/60 flex items-center gap-2 text-xs text-emerald-100 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Nível de Autocontrole: Máximo (Zero compras por impulso)</span>
          </div>
        </section>
      )}

      {/* 2. RECONHECIMENTO DE ITENS ADIADOS */}
      {hasSuccessfulPostponement && (
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Itens com Compra Evitada</span>
            </div>
            {totalSaved > 0 && (
              <span className="text-emerald-700 font-extrabold">
                +R$ {totalSaved.toFixed(2).replace('.', ',')} poupados
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Você adiou: {postponedImpulses.map((i) => i.name).join(', ')}. O desejo de impulso costuma desaparecer em 48 horas.
          </p>
        </section>
      )}

      {/* 3. EXTRATO REAL DE PRODUTOS LEVADOS AO CAIXA */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Produtos que Você Vai Pagar no Caixa
            </h3>
          </div>
          <Link
            href="/lista"
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Editar no mercado
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {purchasedItems.map((item) => {
            const isNonEssential = item.category === 'reflection';

            return (
              <div key={item.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-400">•</span>
                  <span className="font-medium text-slate-800 truncate">{item.name}</span>
                  {isNonEssential && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                      Não Essencial
                    </span>
                  )}
                </div>
                <span className="font-semibold text-slate-700 shrink-0 pl-2">
                  {item.price > 0 ? (
                    `R$ ${item.price.toFixed(2).replace('.', ',')}`
                  ) : (
                    <span className="text-[11px] text-slate-400 italic font-normal">A definir no mercado</span>
                  )}
                </span>
              </div>
            );
          })}

          {/* Subtotal Compras */}
          <div className="pt-3 flex items-center justify-between text-sm font-bold text-slate-900">
            <div>
              <span>Preço Total no Caixa:</span>
              {unpricedPurchasedCount > 0 && (
                <span className="block text-[10px] text-amber-700 font-normal">
                  ({unpricedPurchasedCount} {unpricedPurchasedCount === 1 ? 'item' : 'itens'} sem preço definido)
                </span>
              )}
            </div>
            <span className="text-base text-emerald-800">
              R$ {totalSpent.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </section>

      {/* 4. DICA DE COMPROMISSO COM O PRÓXIMO MERCADO */}
      <section className="bg-slate-900 text-white rounded-3xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Flame className="w-4 h-4" />
          <span>Desafio da Próxima Compra</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          &ldquo;O consumo consciente não é sobre se privar, mas sobre decidir onde seu esforço deve estar. Planeje sua próxima ida ao mercado com pelo menos 1 dia de antecedência.&rdquo;
        </p>
      </section>

      {/* 5. AÇÕES DE NAVEGAÇÃO E REINÍCIO */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href="/lista"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Voltar à Lista
        </Link>

        <button
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Novo Ciclo de Compras
        </button>
      </div>
    </div>
  );
}
