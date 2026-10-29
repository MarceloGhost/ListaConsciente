import { GroceryItem } from '../types';

// Normalized list of common essentials (food staples, basic home hygiene/maintenance)
const ESSENTIAL_KEYWORDS = [
  'arroz',
  'feijao',
  'feijão',
  'carne',
  'frango',
  'peixe',
  'leite',
  'ovo',
  'ovos',
  'pao',
  'pão',
  'macarrao',
  'macarrão',
  'oleo',
  'óleo',
  'azeite',
  'sal',
  'acucar',
  'açucar',
  'açúcar',
  'cafe',
  'café',
  'manteiga',
  'queijo',
  'papel higienico',
  'papel higiênico',
  'sabonete',
  'pasta de dente',
  'creme dental',
  'escova de dentes',
  'escova de dente',
  'detergente',
  'agua sanitaria',
  'água sanitária',
  'sabao',
  'sabão',
  'desinfetante',
  'cebola',
  'alho',
  'tomate',
  'batata',
  'cenoura',
  'banana',
  'maca',
  'maçã',
  'fruta',
  'legume',
  'verdura',
  'resistencia de chuveiro',
  'resistência de chuveiro',
  'lampada',
  'lâmpada',
  'gas',
  'gás'
];

// Discretionary / impulse / non-essential items
const IMPULSE_KEYWORDS = [
  'flor',
  'flores',
  'brinquedo',
  'brinquedos',
  'garrafa',
  'garrafinha',
  'copo',
  'caneca',
  'chocolate',
  'bombom',
  'biscoito',
  'bolacha',
  'refrigerante',
  'coca',
  'coca-cola',
  'cerveja',
  'vinho',
  'whisky',
  'salgadinho',
  'chips',
  'doce',
  'doces',
  'sorvete',
  'bala',
  'chiclete',
  'energetico',
  'energético',
  'revista',
  'livro',
  'vela',
  'planta',
  'vaso',
  'perfume',
  'bugiganga',
  'guloseima',
  'enfeite',
  'fone',
  'capinha',
  'maquiagem'
];

export function parseAndAnalyzeList(rawText: string): GroceryItem[] {
  if (!rawText || !rawText.trim()) return [];

  const rawParts = rawText
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return rawParts.map((part, index) => {
    let itemName = part;
    let explicitPrice = 0;
    let hasPrice = false;

    // Detect if user wrote a price in the string (e.g. "Arroz R$ 25", "Flor 35,00", "Carne 40")
    const priceMatch = part.match(/(?:R\$\s*|r\$\s*|\$)?(\d+[.,]?\d*)\s*$/);
    if (priceMatch && !part.match(/^\d+$/)) {
      const numStr = priceMatch[1].replace(',', '.');
      const parsedNum = parseFloat(numStr);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        explicitPrice = parsedNum;
        hasPrice = true;
        itemName = part.replace(priceMatch[0], '').trim();
      }
    }

    const cleanLower = itemName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Is it impulse/reflection?
    const isImpulse = IMPULSE_KEYWORDS.some((kw) => {
      const normKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return cleanLower.includes(normKw);
    });

    const category = isImpulse ? 'reflection' : 'essential';
    const formattedName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

    return {
      id: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      name: formattedName,
      category,
      checked: false,
      // NO DEFAULT MOCK PRICES: User must set or estimate!
      price: hasPrice ? explicitPrice : 0,
      hasUserDefinedPrice: hasPrice,
      isPriceEstimatedByUser: false,
      reflectionStatus: category === 'reflection' ? 'pending' : 'none',
      reflectionChecks: {
        emotional: false,
        plannedUse: false,
        cashTest: false,
      },
    };
  });
}
