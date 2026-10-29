'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUp, 
  Check, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  RotateCcw,
  ArrowRight, 
  DollarSign, 
  CircleHelp, 
  CheckCircle2, 
  ShieldAlert,
  Coins,
  Edit2
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ChatPage() {
  const { 
    rawInput, 
    items, 
    isAnalyzed, 
    submittedAt,
    analyzeList, 
    loadSampleData, 
    postponeItem, 
    keepItem, 
    toggleItemCategory,
    setReflectionCheck,
    updateItemPrice,
    resetAll 
  } = useStore();

  const [inputVal, setInputVal] = useState('');
  const [priceInput, setPriceInput] = useState<string>('');
  const [isEstimatedChoice, setIsEstimatedChoice] = useState(false);
  const [showEssentialPrices, setShowEssentialPrices] = useState(false);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    analyzeList(inputVal);
    setInputVal('');
    setPriceInput('');
  };

  const essentialItems = items.filter((i) => i.category === 'essential');
  const reflectionItems = items.filter((i) => i.category === 'reflection');
  const pendingReflectionItem = reflectionItems.find((i) => i.reflectionStatus === 'pending');

  const handleSavePrice = (id: string, isEstimated: boolean) => {
    const val = parseFloat(priceInput.replace(',', '.'));
    if (!isNaN(val) && val > 0) {
      updateItemPrice(id, val, isEstimated);
    } else {
      // If user clicks estimated without typing, default to asking or saving minimal user input
      updateItemPrice(id, 0, isEstimated);
    }
    setPriceInput('');
  };

  return (
    <div className="flex flex-col min-h-full space-y-4 pb-12">
      {/* State A: EMPTY STATE */}
      {!isAnalyzed || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 px-2 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Planeje suas Compras Sem Distrações
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Digite os itens da sua lista. O assistente analisa cada produto, solicita os valores reais ou aproximados definidos por você e conduz a reflexão de pré-compra.
            </p>
          </div>

          {/* Quick Demo Button with the User's Target 5 Items */}
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sugestão para Teste
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                5 itens sem preço prévio
              </span>
            </div>

            <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              &ldquo;Arroz, feijão, carne, papel higiênico, flor&rdquo;
            </p>

            <button
              onClick={() => {
                loadSampleData();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Preencher com lista de exemplo
            </button>
          </div>
        </div>
      ) : (
        /* State B: CONVERSATION & ANALYSIS VIEW */
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Conversa de Análise</span>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Nova lista
            </button>
          </div>

          {/* User Message Bubble with dynamic timestamp */}
          <div className="flex flex-col items-end space-y-1">
            <div className="bg-[#1A1C1E] text-white rounded-3xl rounded-tr-md px-5 py-3.5 max-w-[90%] shadow-sm">
              <p className="text-sm font-medium leading-relaxed">
                {rawInput}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 pr-2">
              {submittedAt || 'Hoje'}
            </span>
          </div>

          {/* Assistant Card: Itens Identificados */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Itens Identificados
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Toque na tag para alternar categoria
              </span>
            </div>

            {/* ESSENCIAIS LIST */}
            {essentialItems.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Essenciais ({essentialItems.length})</span>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-2">
                  {essentialItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        <span className="text-slate-800 font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.hasUserDefinedPrice ? (
                          <span className="text-xs font-semibold text-slate-700">
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic font-medium">
                            Preço a definir
                          </span>
                        )}
                        <button
                          onClick={() => toggleItemCategory(item.id)}
                          title="Avaliar como possível impulso"
                          className="text-[10px] text-slate-400 hover:text-amber-700 px-1.5 py-0.5 rounded border border-slate-200 hover:bg-amber-50"
                        >
                          Refletir?
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NON-ESSENTIAL / IN ANALYSIS ITEMS (e.g. Flor, Brinquedos, Garrafa) */}
            {reflectionItems.map((item) => (
              <div
                key={item.id}
                className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">⚠️</span>
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{item.name}</span>
                    <p className="text-[11px] text-amber-800 font-medium">
                      Item não essencial identificado
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {item.reflectionStatus === 'pending'
                      ? 'Em Análise'
                      : item.reflectionStatus === 'postponed'
                      ? 'Adiado para o futuro'
                      : 'Mantido na lista'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* STEP 1: SOLICITAR O PREÇO DO PRODUTO AO USUÁRIO (se ainda não tiver preço definido) */}
          {pendingReflectionItem && !pendingReflectionItem.hasUserDefinedPrice && (
            <div className="bg-white rounded-3xl border-2 border-amber-400 shadow-sm p-5 space-y-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Coins className="w-5 h-5 text-[#E65100]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Qual o valor de &ldquo;{pendingReflectionItem.name}&rdquo;?
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Para fazermos a reflexão de pré-compra, informe quanto custa esse item. Se não souber o valor exato, informe um valor aproximado estimado por você.
                  </p>
                </div>
              </div>

              {/* Price input form */}
              <div className="space-y-3 pt-1">
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-bold text-slate-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.50"
                    autoFocus
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleSavePrice(pendingReflectionItem.id, false)}
                    disabled={!priceInput || parseFloat(priceInput) <= 0}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirmar Preço Exato
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSavePrice(pendingReflectionItem.id, true)}
                    disabled={!priceInput || parseFloat(priceInput) <= 0}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 transition-colors border border-amber-300 flex items-center justify-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    Salvar Valor Aproximado
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  * O assistente não inventa preços; a reflexão depende da sua estimativa real.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: CHECKLIST MENTAL PRÉ-COMPRA COM BASE NO PREÇO INFORMADO PELO USUÁRIO */}
          {pendingReflectionItem && pendingReflectionItem.hasUserDefinedPrice && (
            <div className="bg-white rounded-3xl border border-amber-200 shadow-sm p-5 space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CircleHelp className="w-5 h-5 text-[#E65100]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Checklist Mental Pré-Compra
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Com base no valor de{' '}
                      <strong className="text-slate-900">
                        R$ {pendingReflectionItem.price.toFixed(2).replace('.', ',')}
                      </strong>{' '}
                      {pendingReflectionItem.isPriceEstimatedByUser ? '(estimado por você)' : ''} para &ldquo;
                      <strong>{pendingReflectionItem.name}</strong>&rdquo;, avalie com sinceridade:
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => updateItemPrice(pendingReflectionItem.id, 0, false)}
                  className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 shrink-0 p-1"
                  title="Alterar valor informado"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar valor
                </button>
              </div>

              {/* The 3 Essential Mental Checklist Questions */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={pendingReflectionItem.reflectionChecks?.emotional || false}
                    onChange={() => setReflectionCheck(pendingReflectionItem.id, 'emotional')}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-slate-800 font-medium leading-snug">
                    1. Eu não estou comprando isso por ansiedade, tédio ou fome momentânea?
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={pendingReflectionItem.reflectionChecks?.plannedUse || false}
                    onChange={() => setReflectionCheck(pendingReflectionItem.id, 'plannedUse')}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-slate-800 font-medium leading-snug">
                    2. Eu tenho um uso planejado para esse item nas próximas 48 horas?
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={pendingReflectionItem.reflectionChecks?.cashTest || false}
                    onChange={() => setReflectionCheck(pendingReflectionItem.id, 'cashTest')}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-slate-800 font-medium leading-snug">
                    3. Se eu precisasse pagar em notas de dinheiro vivo agora (R$ {pendingReflectionItem.price.toFixed(2).replace('.', ',')}), eu pagaria?
                  </span>
                </label>
              </div>

              {/* Chatbot Feedback on the Checks */}
              {(() => {
                const checks = pendingReflectionItem.reflectionChecks;
                const totalChecked = (checks?.emotional ? 1 : 0) + (checks?.plannedUse ? 1 : 0) + (checks?.cashTest ? 1 : 0);

                if (totalChecked === 3) {
                  return (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Você refletiu com clareza e atendeu aos critérios. Pode manter na lista se for importante.
                      </span>
                    </div>
                  );
                }

                return (
                  <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      {totalChecked === 0 
                        ? 'Responda as 3 perguntas acima antes de colocar no carrinho físico.'
                        : 'Atenção: Nem todos os critérios foram atendidos. Alta probabilidade de compra por impulso.'}
                    </span>
                  </div>
                );
              })()}

              {/* Decision Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => postponeItem(pendingReflectionItem.id)}
                  className="w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Adiar compra (Economizar R$ {pendingReflectionItem.price.toFixed(2).replace('.', ',')})</span>
                </button>

                <button
                  onClick={() => keepItem(pendingReflectionItem.id)}
                  className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Manter na lista mesmo assim
                </button>
              </div>
            </div>
          )}

          {/* Opção para definir valores dos itens essenciais ou editar na lista */}
          {!pendingReflectionItem && items.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Preços dos Produtos
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">
                  Definidos pelo usuário
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Você pode preencher os valores dos itens essenciais agora ou ajustar diretamente no supermercado na tela da Lista.
              </p>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowEssentialPrices(!showEssentialPrices)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {showEssentialPrices ? 'Fechar Preços' : 'Preencher Valores Agora'}
                </button>

                <Link
                  href="/lista"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  Ir para o Mercado
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Editable Price List for Items */}
              {showEssentialPrices && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">R$</span>
                        <input
                          type="number"
                          step="0.50"
                          value={item.price || ''}
                          placeholder="0,00"
                          onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0, false)}
                          className="w-20 p-1 text-right font-semibold text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Input Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-4 border border-slate-200 shadow-md focus-within:ring-2 focus-within:ring-emerald-700"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Digite sua lista..."
              className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-9 h-9 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-emerald-700 shrink-0 shadow-sm"
              title="Enviar lista para análise"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
