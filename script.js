// Referências aos elementos da tela
const display = document.getElementById('display');
const previous = document.getElementById('previous');
const historyList = document.getElementById('historyList');

// Variáveis para controle
let currentInput = '0';
let firstValue = null;
let operator = null;
let shouldReset = false;

// Atualiza a tela
function updateDisplay() {
  display.textContent = currentInput;

  // Mostra a operação no topo, se aplicável
  if (firstValue !== null && operator !== null && !shouldReset) {
    previous.textContent = `${firstValue} ${getOperatorSymbol(operator)}`;
  } else if (!operator) {
    previous.textContent = '';
  }
}

// Reseta tudo
function clear() {
  currentInput = '0';
  firstValue = null;
  operator = null;
  shouldReset = false;
  updateDisplay();
}

// Adiciona número ou ponto
function appendNumber(number) {
  if (shouldReset) {
    currentInput = number === '.' ? '0.' : number;
    shouldReset = false;
  } else if (number === '.' && currentInput.includes('.')) {
    return;
  } else {
    currentInput = currentInput === '0' && number !== '.' ? number : currentInput + number;
  }
  updateDisplay();
}

// Armazena operador e valor anterior
function chooseOperator(op) {
  if (operator && !shouldReset) {
    calculate(); // calcula se já havia algo antes
  }
  firstValue = parseFloat(currentInput);
  operator = op;
  shouldReset = true;
}

// Converte a palavra-chave para símbolo visual
function getOperatorSymbol(op) {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '−';
    case 'multiply': return '×';
    case 'divide': return '÷';
    default: return '';
  }
}

// Faz o cálculo e atualiza o histórico
function calculate() {
  if (operator === null || shouldReset) return;

  const secondValue = parseFloat(currentInput);

  // Monta o texto da operação
  previous.textContent = `${firstValue} ${getOperatorSymbol(operator)} ${secondValue} =`;

  // Calcula o resultado
  let result;
  switch (operator) {
    case 'add': result = firstValue + secondValue; break;
    case 'subtract': result = firstValue - secondValue; break;
    case 'multiply': result = firstValue * secondValue; break;
    case 'divide':
      result = secondValue !== 0 ? firstValue / secondValue : 'Erro';
      break;
  }

  // Adiciona ao histórico
  const item = document.createElement('li');
  item.textContent = `${firstValue} ${getOperatorSymbol(operator)} ${secondValue} = ${result}`;
  historyList.prepend(item); // coloca no topo da lista

  // Prepara nova entrada
  currentInput = result.toString();
  firstValue = null;
  operator = null;
  shouldReset = true;
  updateDisplay();
}

// Inverte sinal (+/-)
function invertSign() {
  currentInput = (parseFloat(currentInput) * -1).toString();
  updateDisplay();
}

// Calcula porcentagem
function percent() {
  currentInput = (parseFloat(currentInput) / 100).toString();
  updateDisplay();
}

// Escuta os cliques dos botões
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => {
    const number = button.dataset.number;
    const action = button.dataset.action;

    if (number !== undefined) {
      appendNumber(number);
    } else if (action === 'clear') {
      clear();
    } else if (action === 'invert') {
      invertSign();
    } else if (action === 'percent') {
      percent();
    } else if (action === 'equals') {
      calculate();
    } else {
      chooseOperator(action);
    }
  });
});