'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Lightbulb, 
  Sparkles, 
  RotateCw, 
  ShoppingBag, 
  AlertTriangle, 
  CheckCircle2, 
  HeartHandshake, 
  Compass, 
  Eye, 
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DynamicTip } from '../../types';

export default function ReflexaoPage() {
  const { items } = useStore();
  const [seed, setSeed] = useState(0);

  // Generate dynamic, contextual tips based on the user's specific cart items
  const generateDynamicTips = (): DynamicTip[] => {
    if (items.length === 0) {
      return [
        {
          id: 'empty-1',
          tag: 'Hábito Consciente',
          title: 'A Lista é Seu Escudo',
          description: 'Nunca entre em um supermercado sem uma lista definida. Sem ela, 60% das decisões de compra são tomadas por estímulo visual nas gôndolas.',
          type: 'strategy',
        },
        {
          id: 'empty-2',
          tag: 'Fisiologia & Consumo',
          title: 'Regra do Estômago Cheio',
          description: 'Fazer compras com fome altera a tomada de decisão neurológica, priorizando alimentos de alta caloria e itens de consumo por impulso.',
          type: 'strategy',
        },
      ];
    }

    const tips: DynamicTip[] = [];
    const itemNamesLower = items.map((i) => i.name.toLowerCase());
    const keptImpulses = items.filter((i) => i.category === 'reflection' && i.reflectionStatus === 'kept');
    const postponedImpulses = items.filter((i) => i.reflectionStatus === 'postponed');

    // 1. Contextual Feedback on items the user persisted in keeping
    if (keptImpulses.length > 0) {
      const keptNames = keptImpulses.map((i) => `"${i.name}"`).join(', ');
      tips.push({
        id: `kept-alert-${seed}`,
        tag: 'Alerta de Persistência',
        title: `Atenção aos itens: ${keptNames}`,
        description: `Você optou por manter itens não essenciais na lista. Dica de autogestão: comprometa-se a colocar esse item em uso real nas próximas 24 horas para garantir que não se torne acúmulo desnecessário.`,
        contextItem: keptNames,
        type: 'alert',
      });
    }

    // 2. Contextual Feedback on postponed items (praise & reinforcement)
    if (postponedImpulses.length > 0) {
      const postNames = postponedImpulses.map((i) => `"${i.name}"`).join(', ');
      const totalSaved = postponedImpulses.reduce((acc, i) => acc + i.price, 0);
      tips.push({
        id: `postponed-praise-${seed}`,
        tag: 'Conquista de Autocontrole',
        title: `Pausa consciente em ${postNames}`,
        description: `Excelente autodomínio! Ao adiar ${postNames}, você preservou R$ ${totalSaved.toFixed(2).replace('.', ',')} no bolso. Esse pequeno 'não' fortalece sua disciplina para decisões maiores.`,
        contextItem: postNames,
        type: 'praise',
      });
    }

    // 3. Contextual tips based on specific categories present in cart
    const hasToysOrKids = itemNamesLower.some((n) => n.includes('brinquedo') || n.includes('criança') || n.includes('crianca') || n.includes('jogo'));
    const hasBottlesOrObjects = itemNamesLower.some((n) => n.includes('garrafa') || n.includes('copo') || n.includes('caneca') || n.includes('flor') || n.includes('vela'));
    const hasSweetsOrSnacks = itemNamesLower.some((n) => n.includes('chocolate') || n.includes('refrigerante') || n.includes('biscoito') || n.includes('salgadinho') || n.includes('doce'));
    const hasPerishables = itemNamesLower.some((n) => n.includes('carne') || n.includes('tomate') || n.includes('maca') || n.includes('maçã') || n.includes('banana') || n.includes('fruta'));

    if (hasToysOrKids) {
      const kidTips = [
        {
          id: 'kids-1',
          tag: 'Família & Mercado',
          title: 'Armadilha das Gôndolas Infantis',
          description: 'Itens como brinquedos são colocados estrategicamente na altura dos olhos das crianças próximo ao caixa. Dica: dê a elas uma missão ativa no mercado (ex.: ajudar a contar 4 maçãs) para desviar o foco de compras não planejadas.',
          type: 'strategy' as const,
        },
        {
          id: 'kids-2',
          tag: 'Gestão Financeira Infantil',
          title: 'Presente Programado vs. Impulso',
          description: 'Brinquedos comprados no impulso do mercado perdem o encanto em poucos dias. Transforme compras de agrado em metas combinadas em casa, ensinando o valor da espera.',
          type: 'strategy' as const,
        },
      ];
      tips.push(kidTips[seed % kidTips.length]);
    }

    if (hasBottlesOrObjects) {
      const objTips = [
        {
          id: 'obj-1',
          tag: 'Objetos & Decoração',
          title: 'O Teste do Lugar Físico',
          description: 'Antes de levar garrafas, potes ou flores, feche os olhos e responda: onde exatamente isso vai morar na sua casa? Se já tiver similares no armário, o novo item apenas rouba espaço e dinheiro.',
          type: 'strategy' as const,
        },
        {
          id: 'obj-2',
          tag: 'Minimalismo Doméstico',
          title: 'Regra de Entrada e Saída',
          description: 'Para cada objeto não consumível que entra na sua casa, um similar deve ser doado ou descartado. Se não estiver disposto a doar algo atual, não leve o novo.',
          type: 'strategy' as const,
        },
      ];
      tips.push(objTips[seed % objTips.length]);
    }

    if (hasSweetsOrSnacks) {
      const snackTips = [
        {
          id: 'snack-1',
          tag: 'Alimentação & Dopamina',
          title: 'O Gatilho da Recompensa Imediata',
          description: 'Guloseimas compradas por impulso geralmente atendem a cansaço mental, não fome real. Se quiser levar, defina uma cota máxima de 1 item consciente por compra.',
          type: 'strategy' as const,
        },
        {
          id: 'snack-2',
          tag: 'Rotulagem & Foco',
          title: 'Superando as Pontas de Gôndola',
          description: 'Os produtos ultraprocessados pagam taxas aos mercados para ficarem nas pontas dos corredores. Mantenha os olhos nas prateleiras centrais onde estão os alimentos básicos.',
          type: 'strategy' as const,
        },
      ];
      tips.push(snackTips[seed % snackTips.length]);
    }

    if (hasPerishables) {
      const perishTips = [
        {
          id: 'perish-1',
          tag: 'Combate ao Desperdício',
          title: 'Planejamento de Frescos e Carnes',
          description: 'Alimentos frescos representam mais de 30% das perdas domésticas. Certifique-se de que cada carne ou legume na sua lista tem dia certo para ser preparado até o fim de semana.',
          type: 'strategy' as const,
        },
        {
          id: 'perish-2',
          tag: 'Congelamento Estratégico',
          title: 'Porcionamento Consciente',
          description: 'Ao chegar em casa com carnes e feijão, porcione em porções diárias antes de guardar. Isso evita descongelar em excesso e jogar dinheiro fora.',
          type: 'strategy' as const,
        },
      ];
      tips.push(perishTips[seed % perishTips.length]);
    }

    // 4. If list is 100% disciplined staples
    if (keptImpulses.length === 0 && postponedImpulses.length === 0) {
      const cleanTips = [
        {
          id: 'clean-1',
          tag: 'Eficiência de Corredor',
          title: 'Tática da Rota Rápida',
          description: 'Sua lista atual contém apenas itens básicos essenciais! A melhor autogestão é reduzir o tempo no mercado: faça suas compras em menos de 20 minutos para minimizar a exposição a distrações visuais.',
          type: 'strategy' as const,
        },
        {
          id: 'clean-2',
          tag: 'Orçamento Blindado',
          title: 'Sem Desvios de Foco',
          description: 'Você planejou perfeitamente suas prioridades. Resista a qualquer carrinho com promoções no caminho até os caixas registradores.',
          type: 'strategy' as const,
        },
      ];
      tips.push(cleanTips[seed % cleanTips.length]);
    }

    return tips;
  };

  const dynamicTips = generateDynamicTips();

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <section className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>Autogestão de Compras</span>
          </div>

          <button
            onClick={() => setSeed((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 transition-colors"
            title="Gerar novas dicas contextuais"
          >
            <RotateCw className="w-3 h-3" />
            Novas dicas
          </button>
        </div>

        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Feedback Personalizado da Sua Lista
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Estas orientações foram geradas a partir dos itens exatos que você planeja comprar hoje ({items.length} itens no total).
        </p>
      </section>

      {/* Dynamic Feedback Cards */}
      <div className="space-y-3">
        {dynamicTips.map((tip) => (
          <div
            key={tip.id}
            className={`rounded-3xl p-5 border shadow-sm space-y-2.5 transition-all ${
              tip.type === 'alert'
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : tip.type === 'praise'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-white border-slate-200/90 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  tip.type === 'alert'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : tip.type === 'praise'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {tip.tag}
              </span>

              {tip.type === 'alert' && <AlertTriangle className="w-4 h-4 text-[#E65100]" />}
              {tip.type === 'praise' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              {tip.type === 'strategy' && <Lightbulb className="w-4 h-4 text-amber-500" />}
            </div>

            <h3 className="text-sm font-bold tracking-tight">
              {tip.title}
            </h3>

            <p className="text-xs leading-relaxed opacity-90">
              {tip.description}
            </p>
          </div>
        ))}
      </div>

      {/* Action to proceed to Checklist or Incentive */}
      <div className="flex gap-2 pt-2">
        <Link
          href="/lista"
          className="flex-1 py-3 px-4 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-center"
        >
          Ir ao Mercado
        </Link>
        <Link
          href="/metricas"
          className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors text-center shadow-sm"
        >
          Ver Diagnóstico
        </Link>
      </div>
    </div>
  );
}
