import { parseAndAnalyzeList } from '../src/utils/analyzer.ts';

console.log('🧪 Iniciando bateria de testes do Analisador...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
  }
}

// TESTE 1: Lista Inicial de 5 itens SEM preços embutidos (app não inventa preços)
console.log('--- Teste 1: Reconhecimento da lista padrão de 5 itens (sem preços mockados) ---');
const list1 = 'Arroz, feijão, carne, papel higiênico, flor';
const items1 = parseAndAnalyzeList(list1);

assert(items1.length === 5, 'Deve identificar exatamente 5 itens');
const florItem = items1.find((i) => i.name.toLowerCase() === 'flor');
assert(florItem !== undefined, 'Item "Flor" deve estar presente na lista');
assert(florItem?.category === 'reflection', 'Item "Flor" deve ser categorizado como "reflection"');
assert(florItem?.reflectionStatus === 'pending', 'Item "Flor" deve iniciar com status "pending"');
assert(florItem?.price === 0, 'O sistema NÃO deve estimar preço automaticamente (preço inicial = 0)');
assert(florItem?.hasUserDefinedPrice === false, 'hasUserDefinedPrice deve ser false até o usuário informar');

// TESTE 2: Reconhecimento de itens supérfluos adicionais
console.log('\n--- Teste 2: Reconhecimento de itens supérfluos adicionais ---');
const list2 = 'Macarrão, Tomate, Brinquedos para minhas crianças, Garrafa, Resistência de chuveiro';
const items2 = parseAndAnalyzeList(list2);

const brinquedoItem = items2.find((i) => i.name.toLowerCase().includes('brinquedo'));
const garrafaItem = items2.find((i) => i.name.toLowerCase().includes('garrafa'));
const resistenciaItem = items2.find((i) => i.name.toLowerCase().includes('resistência'));

assert(brinquedoItem?.category === 'reflection', 'Brinquedos deve ser classificado como "reflection"');
assert(garrafaItem?.category === 'reflection', 'Garrafa deve ser classificada como "reflection"');
assert(resistenciaItem?.category === 'essential', 'Resistência de chuveiro deve ser classificada como essencial');

// TESTE 3: Parsing quando o usuário digita preços no texto
console.log('\n--- Teste 3: Parsing quando o usuário digita preços diretamente ---');
const list3 = 'Arroz R$ 30, Carne 45.00, Flor 35';
const items3 = parseAndAnalyzeList(list3);

const arroz3 = items3.find((i) => i.name.toLowerCase() === 'arroz');
const carne3 = items3.find((i) => i.name.toLowerCase() === 'carne');
const flor3 = items3.find((i) => i.name.toLowerCase() === 'flor');

assert(arroz3?.price === 30 && arroz3.hasUserDefinedPrice === true, 'Preço de Arroz deve ser 30 (informado pelo usuário)');
assert(carne3?.price === 45 && carne3.hasUserDefinedPrice === true, 'Preço de Carne deve ser 45 (informado pelo usuário)');
assert(flor3?.price === 35 && flor3.hasUserDefinedPrice === true, 'Preço de Flor deve ser 35 (informado pelo usuário)');

console.log(`\n========================================`);
console.log(`Testes do Analisador: ${passedTests}/${totalTests} com sucesso.`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
