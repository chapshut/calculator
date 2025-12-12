const display = document.getElementById('display');

let current = '0';
let previous = null;
let operator = null;
let waitingForNewNumber = false;

function updateDisplay() {
  display.value = current || '0';
}

function inputDigit(digit) {
  if (waitingForNewNumber) {
    current = digit;
    waitingForNewNumber = false;
  } else {
    current = current === '0' ? digit : current + digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (waitingForNewNumber) {
    current = '0.';
    waitingForNewNumber = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
  updateDisplay();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  waitingForNewNumber = false;
  updateDisplay();
}

function backOne() {
  current = current.length <= 1 ? '0' : current.slice(0, -1);
  updateDisplay();
}

// Exact Casio % gedrag
function handlePercent() {
  const value = parseFloat(current);
  if (isNaN(value)) return;

  if (previous !== null && operator) {
    if (operator === '+' || operator === '-') {
      current = String(previous * (value / 100));
    } else {
      current = String(value / 100);
    }
  } else {
    current = String(value / 100);
  }
  updateDisplay();
}

function calculate() {
  if (!operator || previous === null) return;

  const value = parseFloat(current);
  if (isNaN(value)) return;

  let result = 0;
  switch (operator) {
    case '+': result = previous + value; break;
    case '-': result = previous - value; break;
    case '*': result = previous * value; break;
    case '/': result = value === 0 ? 'Error' : previous / value; break;
  }

  current = String(result);
  previous = result;
  operator = null;
  waitingForNewNumber = true;
  updateDisplay();
}

function chooseOperator(op) {
  const value = parseFloat(current);

  if (previous === null) {
    previous = value;
  } else if (operator && !waitingForNewNumber) {  // ← FIX: alleen calculate als er een nieuw getal is
    calculate();
  }

  operator = op;
  waitingForNewNumber = true;
}

// KNOPPEN
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.value;

    if ('0123456789'.includes(v)) inputDigit(v);
    else if (v === '.') inputDecimal();
    else if (v === 'C') clearAll();
    else if (v === 'Backspace') backOne();
    else if (v === '%') handlePercent();
    else if (v === '=') calculate();
    else chooseOperator(v === '×' ? '*' : v === '÷' ? '/' : v);
  });
});

// TOETSENBORD
document.addEventListener('keydown', e => {
  if ('0123456789'.includes(e.key)) { e.preventDefault(); inputDigit(e.key); }
  else if (e.key === '.' || e.key === ',') { e.preventDefault(); inputDecimal(); }
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
  else if (e.key === 'Escape' || e.key === 'Delete') { e.preventDefault(); clearAll(); }
  else if (e.key === 'Backspace') { e.preventDefault(); backOne(); }
  else if ('+-*/'.includes(e.key)) { e.preventDefault(); chooseOperator(e.key); }
  else if (e.key === '%') { e.preventDefault(); handlePercent(); }
});

updateDisplay();
