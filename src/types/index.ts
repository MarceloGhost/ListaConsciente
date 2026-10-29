export type ItemCategory = 'essential' | 'reflection';

export type ReflectionStatus = 'none' | 'pending' | 'postponed' | 'kept';

export interface ReflectionChecks {
  emotional: boolean;   // 1. Eu não estou comprando isso por ansiedade, tédio ou fome momentânea?
  plannedUse: boolean;  // 2. Eu tenho um uso planejado para esse item nas próximas 48 horas?
  cashTest: boolean;    // 3. Se eu precisasse pagar em notas de dinheiro vivo agora, eu pagaria?
}

export interface GroceryItem {
  id: string;
  name: string;
  category: ItemCategory;
  checked: boolean;
  price: number;
  hasUserDefinedPrice: boolean;
  isPriceEstimatedByUser: boolean;
  reflectionStatus: ReflectionStatus;
  reflectionChecks?: ReflectionChecks;
}

export interface DynamicTip {
  id: string;
  tag: string;
  title: string;
  description: string;
  contextItem?: string;
  type: 'alert' | 'praise' | 'strategy';
}
