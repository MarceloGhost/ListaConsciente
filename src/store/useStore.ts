import { create } from 'zustand';
import { GroceryItem, ReflectionStatus, ReflectionChecks } from '../types';
import { parseAndAnalyzeList } from '../utils/analyzer';

interface AppState {
  rawInput: string;
  isAnalyzed: boolean;
  items: GroceryItem[];
  submittedAt: string;
  isShoppingCompleted: boolean;
  
  // Actions
  setRawInput: (text: string) => void;
  analyzeList: (text?: string) => void;
  loadSampleData: () => void;
  postponeItem: (id: string) => void;
  keepItem: (id: string) => void;
  toggleItemCategory: (id: string) => void;
  setReflectionCheck: (id: string, checkKey: keyof ReflectionChecks) => void;
  updateItemPrice: (id: string, newPrice: number, isEstimated?: boolean) => void;
  toggleCheck: (id: string) => void;
  completeShopping: () => void;
  resetAll: () => void;
}

const getFormattedTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `Hoje, ${hours}:${minutes}`;
};

export const useStore = create<AppState>((set, get) => ({
  rawInput: '',
  isAnalyzed: false,
  items: [],
  submittedAt: '',
  isShoppingCompleted: false,

  setRawInput: (text: string) => set({ rawInput: text }),

  analyzeList: (text?: string) => {
    const listToParse = text !== undefined ? text : get().rawInput;
    if (!listToParse.trim()) return;

    const analyzedItems = parseAndAnalyzeList(listToParse);
    set({
      rawInput: listToParse,
      items: analyzedItems,
      isAnalyzed: true,
      submittedAt: getFormattedTime(),
      isShoppingCompleted: false,
    });
  },

  loadSampleData: () => {
    const sample = 'Arroz, feijão, carne, papel higiênico, flor';
    const analyzed = parseAndAnalyzeList(sample);
    set({
      rawInput: sample,
      items: analyzed,
      isAnalyzed: true,
      submittedAt: getFormattedTime(),
      isShoppingCompleted: false,
    });
  },

  postponeItem: (id: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, reflectionStatus: 'postponed' as ReflectionStatus } : item
      ),
    })),

  keepItem: (id: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, reflectionStatus: 'kept' as ReflectionStatus } : item
      ),
    })),

  toggleItemCategory: (id: string) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item;
        const newCategory = item.category === 'essential' ? 'reflection' : 'essential';
        return {
          ...item,
          category: newCategory,
          reflectionStatus: newCategory === 'reflection' ? 'pending' : 'none',
        };
      }),
    })),

  setReflectionCheck: (id: string, checkKey: keyof ReflectionChecks) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item;
        const currentChecks = item.reflectionChecks || {
          emotional: false,
          plannedUse: false,
          cashTest: false,
        };
        return {
          ...item,
          reflectionChecks: {
            ...currentChecks,
            [checkKey]: !currentChecks[checkKey],
          },
        };
      }),
    })),

  updateItemPrice: (id: string, newPrice: number, isEstimated = false) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              price: Math.max(0, newPrice),
              hasUserDefinedPrice: newPrice > 0,
              isPriceEstimatedByUser: isEstimated,
            }
          : item
      ),
    })),

  toggleCheck: (id: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    })),

  completeShopping: () =>
    set({
      isShoppingCompleted: true,
    }),

  resetAll: () =>
    set({
      rawInput: '',
      isAnalyzed: false,
      items: [],
      submittedAt: '',
      isShoppingCompleted: false,
    }),
}));
