const display = document.getElementById('display');

let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = currentInput;
}

function handleInput(value) {
  // Numbers and decimal point
  if ('0123456789.'.includes(value)) {
    if (shouldResetDisplay || currentInput === '0') {
      currentInput = value === '.' ? '0.' : value;
      shouldResetDisplay = false;
    } else {
      if (value === '.' && currentInput.includes('.')) return;
      currentInput += value;
    }
  }

  // Operators
  else if ('+-*/'.includes(value)) {
    if (previousInput !== null && !shouldResetDisplay) handleInput('=');
    operator = value;
    previousInput = parseFloat(currentInput);
    shouldResetDisplay = true;
  }

  // Equals
  else if (value === '=') {
    if (!operator || previousInput === null) return;
    const current = parseFloat(currentInput);
    let result;
    switch (operator) {
      case '+': result = previousInput + current; break;
      case '-': result = previousInput - current; break;
      case '*': result = previousInput * current; break;
      case '/': result = previousInput / current; break;
    }
    currentInput = Number.isInteger(result) ? result.toString() : result.toFixed(10).replace(/0+$/, '');
    operator = null;
    previousInput = null;
    shouldResetDisplay = true;
  }

  // Full clear
  else if (value === 'C') {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
  }

  // Clear current entry only
  else if (value === 'CE') {
    currentInput = '0';
    shouldResetDisplay = false;
  }

  // Percent
  else if (value === '%') {
    currentInput = (parseFloat(currentInput) / 100).toString();
  }

  updateDisplay();
}

// Button clicks
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    handleInput(val === '−' ? '-' : val);
  });
});

// Keyboard support
document.addEventListener('keydown', e => {
  // Prevent scrolling
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  const keyMap = {
    '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
    '.':'.', ',':'.', '+':'+', '-':'-', '_':'-', '*':'*', 'x':'*', 'X':'*',
    '/':'/', '÷':'/', '%':'%', 'Enter':'=', '=':'=', 'Escape':'C', 'c':'C'
  };

  if (e.key in keyMap) {
    e.preventDefault();
    handleInput(keyMap[e.key]);
    return;
  }

  // Backspace AND Delete both delete only the last digit
  if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault();
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
    shouldResetDisplay = false;
    updateDisplay();
  }
});

// Start
updateDisplay();
display.focus();