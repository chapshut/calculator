const resultDisplay = document.getElementById('resultDisplay');
const liveInput = document.getElementById('liveInput');

let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetInput = false;

const segments = {
  '0':[1,1,1,1,1,1,0],'1':[0,1,1,0,0,0,0],'2':[1,1,0,1,1,0,1],
  '3':[1,1,1,1,0,0,1],'4':[0,1,1,0,0,1,1],'5':[1,0,1,1,0,1,1],
  '6':[1,0,1,1,1,1,1],'7':[1,1,1,0,0,0,0],'8':[1,1,1,1,1,1,1],
  '9':[1,1,1,1,0,1,1]
};

function renderResult(text) {
  resultDisplay.innerHTML = '';
  if (!text || text === '0') return;

  let hasDecimal = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '.') { hasDecimal = true; continue; }

    const digit = document.createElement('div');
    digit.className = 'digit';

    const pattern = segments[char] || segments['8'];
    'abcdefg'.split('').forEach((s, idx) => {
      const seg = document.createElement('div');
      seg.className = `segment ${s} ${pattern[idx] ? '' : 'off'}`;
      digit.appendChild(seg);
    });

    if (hasDecimal) {
      const dp = document.createElement('div');
      dp.className = 'decimal';
      digit.appendChild(dp);
      hasDecimal = false;
    }
    resultDisplay.appendChild(digit);
  }
}

function handleInput(value) {
  if ('0123456789.'.includes(value)) {
    if (shouldResetInput || currentInput === '0') {
      currentInput = value === '.' ? '0.' : value;
      shouldResetInput = false;
    } else {
      if (value === '.' && currentInput.includes('.')) return;
      currentInput += value;
    }
  }
  else if ('+-*/'.includes(value)) {
    if (previousInput !== null && operator) handleInput('=');
    operator = value;
    previousInput = parseFloat(currentInput || '0');
    shouldResetInput = true;
  }
  else if (value === '=') {
    if (!operator || previousInput === null) return;
    const current = parseFloat(currentInput || '0');
    let result;
    switch (operator) {
      case '+': result = previousInput + current; break;
      case '-': result = previousInput - current; break;
      case '*': result = previousInput * current; break;
      case '/': result = previousInput / current; break;
    }
    renderResult(result.toString());
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetInput = true;
    liveInput.value = '0';
    return;
  }
  else if (value === '%') {
    currentInput = (parseFloat(currentInput || '0') / 100).toString();
  }
  else if (value === 'Backspace') {
    currentInput = currentInput.length <= 1 ? '0' : currentInput.slice(0, -1);
  }

  liveInput.value = currentInput;
}

// Buttons
document.querySelectorAll('button ').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.value;
    const mapped = v==='−'?'-' : v==='×'?'*' : v==='÷'?'/' : v;
    handleInput(mapped);
  });
});

// Keyboard
document.addEventListener('keydown', e => {
  const map = { 'Enter':'=', 'Escape':'C', 'Backspace':'Backspace' };
  if ('0123456789.+-*/%'.includes(e.key) || e.key in map) {
    e.preventDefault();
    if (e.key === 'Escape') {
      currentInput = '0'; operator = null; previousInput = null;
      renderResult(''); liveInput.value = '0';
    } else {
      handleInput(map[e.key] || e.key);
    }
  }
});

// Init
liveInput.value = '0';
renderResult('');
