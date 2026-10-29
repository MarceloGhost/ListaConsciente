import { useStore } from '../src/store/useStore.ts';

console.log('🧪 Iniciando testes de Fluxo de Estado (Zustand Store com Preços do Usuário)...\n');

let passed = 0;
let total = 0;

function assert(condition: boolean, msg: string) {
  total++;
  if (condition) {
    console.log(`✅ [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${msg}`);
  }
}

const store = useStore.getState();

// TEST 1: Estado inicial deve estar completamente vazio
console.log('--- Teste 1: Estado Inicial Vazio ---');
assert(store.items.length === 0, 'A lista de itens deve iniciar vazia');
assert(store.rawInput === '', 'O rawInput deve iniciar vazio');
assert(store.isAnalyzed === false, 'isAnalyzed deve iniciar como false');

// TEST 2: Submissão da lista sem preços (os preços não devem ser inventados)
console.log('\n--- Teste 2: Inserção de Itens e Ausência de Preços Automáticos ---');
useStore.getState().analyzeList('Arroz, feijão, carne, papel higiênico, flor');
const afterAnalysis = useStore.getState();

assert(afterAnalysis.items.length === 5, 'Deve conter 5 itens analisados');
assert(afterAnalysis.isAnalyzed === true, 'isAnalyzed deve ser true');

const flor = afterAnalysis.items.find((i) => i.name.toLowerCase() === 'flor');
assert(flor !== undefined, 'Flor deve estar presente');
assert(flor?.price === 0, 'Flor não deve ter preço inventado pelo sistema');
assert(flor?.hasUserDefinedPrice === false, 'hasUserDefinedPrice deve ser false');

// TEST 3: Usuário informa ou estima o preço do item não essencial
console.log('\n--- Teste 3: Usuário define o preço do produto no Chatbot ---');
if (flor) {
  useStore.getState().updateItemPrice(flor.id, 35.0, true);
  const updatedFlor = useStore.getState().items.find((i) => i.id === flor.id);
  assert(updatedFlor?.price === 35.0, 'Preço de Flor deve ser atualizado para R$ 35,00');
  assert(updatedFlor?.hasUserDefinedPrice === true, 'hasUserDefinedPrice deve ser true agora');
  assert(updatedFlor?.isPriceEstimatedByUser === true, 'isPriceEstimatedByUser deve ser true');
}

// TEST 4: Checklist Mental com o preço real/estimado pelo usuário
console.log('\n--- Teste 4: Checklist Mental Pré-Compra ---');
if (flor) {
  useStore.getState().setReflectionCheck(flor.id, 'emotional');
  const checked1 = useStore.getState().items.find((i) => i.id === flor.id);
  assert(checked1?.reflectionChecks?.emotional === true, 'Pergunta 1 deve estar marcada como true');

  useStore.getState().setReflectionCheck(flor.id, 'cashTest');
  const checked3 = useStore.getState().items.find((i) => i.id === flor.id);
  assert(checked3?.reflectionChecks?.cashTest === true, 'Pergunta 3 (dinheiro vivo) deve estar marcada como true');
}

// TEST 5: Adiar compra com base no valor informado
console.log('\n--- Teste 5: Adiar Compra do Item ---');
if (flor) {
  useStore.getState().postponeItem(flor.id);
  const postponedFlor = useStore.getState().items.find((i) => i.id === flor.id);
  assert(postponedFlor?.reflectionStatus === 'postponed', 'Flor deve ter status "postponed"');
}

// TEST 6: Reset total
console.log('\n--- Teste 6: Reset Total ---');
useStore.getState().resetAll();
const resetState = useStore.getState();
assert(resetState.items.length === 0, 'Após reset, items deve voltar a ser vazio []');
assert(resetState.rawInput === '', 'Após reset, rawInput deve ser string vazia');

console.log(`\n========================================`);
console.log(`Testes de Estado: ${passed}/${total} com sucesso.`);
console.log(`========================================\n`);

if (passed !== total) {
  process.exit(1);
}
