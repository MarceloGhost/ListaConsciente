'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Circle, 
  Check, 
  Clock, 
  Edit3, 
  Sparkles,
  ShoppingBag,
  PlusCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ListaPage() {
  const { 
    items, 
    toggleCheck, 
    updateItemPrice, 
    completeShopping 
  } = useStore();

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Items to buy: essential or kept
  const activeItems = items.filter(
    (item) => item.category === 'essential' || item.reflectionStatus === 'kept'
  );

  // Postponed items
  const postponedItems = items.filter(
    (item) => item.reflectionStatus === 'postponed'
  );

  // Pending items that user hasn't decided yet
  const pendingItems = items.filter(
    (item) => item.category === 'reflection' && item.reflectionStatus === 'pending'
  );

  const startEditPrice = (id: string, currentPrice: number) => {
    setEditingItemId(id);
    setTempPrice(currentPrice > 0 ? currentPrice.toString() : '');
  };

  const saveEditPrice = (id: string) => {
    const val = parseFloat(tempPrice.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      updateItemPrice(id, val, false);
    }
    setEditingItemId(null);
  };

  const totalInCart = activeItems
    .filter((i) => i.checked && i.price > 0)
    .reduce((sum, item) => sum + item.price, 0);

  const totalEstimated = activeItems
    .filter((i) => i.price > 0)
    .reduce((sum, item) => sum + item.price, 0);

  const unpricedCount = activeItems.filter((i) => i.price === 0).length;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-150 text-slate-400 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800">Sua lista está vazia</h2>
          <p className="text-xs text-slate-500 max-w-xs">
            Inicie adicionando seus itens na tela do Assistente para análise consciente.
          </p>
        </div>
        <Link
          href="/chat"
          className="py-2.5 px-5 rounded-2xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Ir para o Assistente
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* SECTION 1: ESSENCIAIS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Essenciais
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {activeItems.length} {activeItems.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-semibold block">
              Total: R$ {totalEstimated.toFixed(2).replace('.', ',')}
            </span>
            {unpricedCount > 0 && (
              <span className="text-[10px] text-amber-700 font-medium">
                ({unpricedCount} a definir no corredor)
              </span>
            )}
          </div>
        </div>

        {/* List of Essential Items as rounded white cards */}
        <div className="space-y-2.5">
          {activeItems.map((item) => {
            const isEditing = editingItemId === item.id;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm transition-all ${
                  item.checked ? 'bg-slate-50/70 border-slate-200' : 'hover:border-slate-300'
                }`}
              >
                {/* Checkbox & Item Name */}
                <button
                  type="button"
                  onClick={() => toggleCheck(item.id)}
                  className="flex items-center gap-3.5 flex-1 text-left min-w-0"
                >
                  {item.checked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-slate-400 shrink-0" />
                  )}

                  <span
                    className={`text-sm font-medium transition-all truncate ${
                      item.checked
                        ? 'line-through text-slate-400'
                        : 'text-slate-900'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>

                {/* Inline Price with Edit Option */}
                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">R$</span>
                      <input
                        type="number"
                        step="0.50"
                        autoFocus
                        value={tempPrice}
                        placeholder="0,00"
                        onChange={(e) => setTempPrice(e.target.value)}
                        onBlur={() => saveEditPrice(item.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditPrice(item.id)}
                        className="w-20 p-1 text-right text-xs font-bold text-slate-800 border border-emerald-500 rounded-lg outline-none bg-emerald-50/30"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditPrice(item.id, item.price)}
                      title="Toque para definir ou editar o preço do produto"
                      className={`inline-flex items-center gap-1 py-1 px-2.5 rounded-lg border text-xs font-semibold transition-colors ${
                        item.price > 0
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                      }`}
                    >
                      {item.price > 0 ? (
                        <>
                          <span>R$ {item.price.toFixed(2).replace('.', ',')}</span>
                          {item.isPriceEstimatedByUser && (
                            <span className="text-[9px] text-slate-400 font-normal">(aprox)</span>
                          )}
                          <Edit3 className="w-3 h-3 text-slate-400 ml-0.5" />
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3 h-3 text-amber-600" />
                          <span>Definir Preço</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: ADIADOS / GUARDADOS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            Adiados / Guardados
          </h2>
          <span className="text-[11px] text-slate-400">
            {postponedItems.length} compras evitadas
          </span>
        </div>

        {postponedItems.length > 0 ? (
          <div className="space-y-2.5">
            {postponedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm text-slate-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium line-through text-slate-400">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70">
                    Adiado para o futuro
                  </span>
                  {item.price > 0 && (
                    <span className="text-xs font-bold text-emerald-700">
                      +R$ {item.price.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : pendingItems.length > 0 ? (
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-900">Item em reflexão pendente</span>
              <p className="text-xs text-slate-600">
                Você ainda não concluiu a reflexão sobre &ldquo;{pendingItems[0].name}&rdquo;.
              </p>
            </div>
            <Link
              href="/chat"
              className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
            >
              Refletir Agora
            </Link>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            Nenhum item adiado nesta sessão.
          </div>
        )}
      </section>

      {/* Cart Summary Pill when shopping */}
      {activeItems.some((i) => i.checked) && (
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium">No carrinho agora:</span>
          </div>
          <span className="text-sm font-bold text-emerald-300">
            R$ {totalInCart.toFixed(2).replace('.', ',')}
          </span>
        </div>
      )}

      {/* BOTTOM ACTION BUTTON: Concluir Compras */}
      <div className="pt-2">
        <Link
          href="/metricas"
          onClick={() => completeShopping()}
          className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Concluir Compras</span>
        </Link>
      </div>
    </div>
  );
}
