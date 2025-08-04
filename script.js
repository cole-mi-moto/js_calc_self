const previousCalculationDisplay = document.querySelector('.previous-calculation');
const currentEquationDisplay = document.querySelector('.current-equation');
const display = document.querySelector('.calculator-display');
const buttons = document.querySelectorAll('.button');

const secondButton = document.getElementById('secondBtn');
const sinButton = document.getElementById('sinBtn');
const cosButton = document.getElementById('cosBtn');
const tanButton = document.getElementById('tanBtn');
const lgButton = document.getElementById('lgBtn');
const lnButton = document.getElementById('lnBtn');
const sqrtButton = document.getElementById('sqrtBtn');
const xpyButton = document.getElementById('xpyBtn');

let currentInput = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

let previousCalculationLine = '';
let currentEquationLine = '';
let displayOperator = null;

let isSecondFunctionActive = false;

const scientificButtonsToToggle = [
    sinButton, cosButton, tanButton, lgButton, lnButton, sqrtButton, xpyButton
];

function toggleScientificButtonsText() {
    scientificButtonsToToggle.forEach(btn => {
        if (btn && btn.dataset) {
            if (isSecondFunctionActive) {
                btn.textContent = btn.dataset.secondaryText || btn.dataset.primaryText;
            } else {
                btn.textContent = btn.dataset.primaryText;
            }
        }
    });
}

secondButton.addEventListener('click', () => {
    isSecondFunctionActive = !isSecondFunctionActive;
    secondButton.classList.toggle('active', isSecondFunctionActive);
    toggleScientificButtonsText();
});

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        const buttonClassList = button.classList;

        if (display.value === 'Error') {
            handleClear();
        }

        if (buttonClassList.contains('number')) {
            if (waitingForSecondOperand && operator === null) {
                handleClear(); 
            }
            if (buttonText === '.' && currentInput.includes('.')) {
                return;
            }

            if (waitingForSecondOperand) {
                currentInput = buttonText;
                waitingForSecondOperand = false;
                if (firstOperand !== null && displayOperator !== null) {
                    currentEquationLine = `${firstOperand} ${displayOperator} ${currentInput}`;
                } else {
                    currentEquationLine = currentInput;
                }
            } else {
                currentInput = currentInput === '0' && buttonText !== '.' ? buttonText : currentInput + buttonText;
                if (firstOperand !== null && displayOperator !== null) {
                    currentEquationLine = `${firstOperand} ${displayOperator} ${currentInput}`;
                } else {
                    currentEquationLine = currentInput;
                }
            }
            display.value = currentInput;
            currentEquationDisplay.textContent = currentEquationLine;
            return;
        }

        if (buttonClassList.contains('operator')) {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentInput);
            } else if (operator && !waitingForSecondOperand) {
                const result = calculate(firstOperand, parseFloat(currentInput), operator);
                if (result === 'Error') {
                    handleClear();
                    display.value = 'Error';
                    return;
                }
                firstOperand = result;
                currentInput = String(result);
                display.value = currentInput;
            }

            operator = buttonText === '÷' ? '/' : buttonText === '×' ? '*' : buttonText;
            displayOperator = buttonText;
            waitingForSecondOperand = true;

            currentEquationLine = `${firstOperand} ${displayOperator} `;
            currentEquationDisplay.textContent = currentEquationLine;
            return;
        }

        if (buttonClassList.contains('equals')) {
            if (firstOperand === null || operator === null || waitingForSecondOperand) {
                return;
            }

            const secondOperand = parseFloat(currentInput);
            const result = calculate(firstOperand, secondOperand, operator);

            if (result === 'Error') {
                handleClear();
                display.value = 'Error';
                return;
            }

            display.value = String(result);
            currentInput = String(result);

            previousCalculationLine = `${firstOperand} ${displayOperator} ${secondOperand} = ${result}`;
            previousCalculationDisplay.textContent = previousCalculationLine;

            currentEquationLine = '';
            currentEquationDisplay.textContent = '';

            firstOperand = result;
            operator = null;
            displayOperator = null;
            waitingForSecondOperand = true;
            return;
        }

        if (buttonClassList.contains('clear')) {
            handleClear();
            return;
        }

        if (buttonClassList.contains('backspace')) {
            if (currentInput.length > 1 && currentInput !== '0') {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            display.value = currentInput;

            if (firstOperand !== null && displayOperator !== null && !waitingForSecondOperand) {
                 currentEquationLine = `${firstOperand} ${displayOperator} ${currentInput}`;
            } else if (!operator) {
                 currentEquationLine = currentInput;
            }
            currentEquationDisplay.textContent = currentEquationLine;
            return;
        }
        
        if (buttonClassList.contains('function') || buttonClassList.contains('constant')) {
            let processedResult;
            const num = parseFloat(currentInput);

            switch (buttonText) {
                case 'sin':
                    processedResult = Math.sin(num * Math.PI / 180);
                    break;
                case 'cos':
                    processedResult = Math.cos(num * Math.PI / 180);
                    break;
                case 'tan':
                    processedResult = Math.tan(num * Math.PI / 180);
                    break;
                case 'asin':
                    processedResult = Math.asin(num) * 180 / Math.PI;
                    break;
                case 'acos':
                    processedResult = Math.acos(num) * 180 / Math.PI;
                    break;
                case 'atan':
                    processedResult = Math.atan(num) * 180 / Math.PI;
                    break;
                case 'lg':
                    processedResult = Math.log10(num);
                    break;
                case 'ln':
                    processedResult = Math.log(num);
                    break;
                case '10ˣ':
                    processedResult = 10 ** num;
                    break;
                case 'eˣ':
                    processedResult = Math.exp(num);
                    break;
                case 'x!':
                    if (num < 0 || !Number.isInteger(num)) {
                        processedResult = 'Error';
                    } else {
                        let fact = 1;
                        for (let i = 2; i <= num; i++) fact *= i;
                        processedResult = fact;
                    }
                    break;
                case 'xʸ':
                    if (firstOperand === null) {
                        firstOperand = parseFloat(currentInput);
                    } else if (operator && !waitingForSecondOperand) {
                        const result = calculate(firstOperand, parseFloat(currentInput), operator);
                        if (result === 'Error') { handleClear(); display.value = 'Error'; return; }
                        firstOperand = result;
                        currentInput = String(result); display.value = currentInput;
                    }
                    operator = '^';
                    displayOperator = '^';
                    waitingForSecondOperand = true;
                    currentEquationLine = `${firstOperand} ${displayOperator} `;
                    currentEquationDisplay.textContent = currentEquationLine;
                    return;
                case 'y√x':
                    if (firstOperand === null) {
                        firstOperand = parseFloat(currentInput);
                    } else if (operator && !waitingForSecondOperand) {
                        const result = calculate(firstOperand, parseFloat(currentInput), operator);
                        if (result === 'Error') { handleClear(); display.value = 'Error'; return; }
                        firstOperand = result;
                        currentInput = String(result); display.value = currentInput;
                    }
                    operator = 'yroot';
                    displayOperator = buttonText;
                    waitingForSecondOperand = true;
                    currentEquationLine = `${firstOperand} ${displayOperator} `;
                    currentEquationDisplay.textContent = currentEquationLine;
                    return;
                case '√x':
                    processedResult = Math.sqrt(num);
                    break;
                case 'x²':
                    processedResult = num * num;
                    break;
                case '1/x':
                    if (num === 0) {
                        processedResult = 'Error';
                    } else {
                        processedResult = 1 / num;
                    }
                    break;
                case 'π':
                    processedResult = Math.PI;
                    break;
                case 'e':
                    processedResult = Math.E;
                    break;
                case '(':
                case ')':
                    currentInput = currentInput === '0' ? buttonText : currentInput + buttonText;
                    display.value = currentInput;
                    currentEquationLine = (firstOperand !== null && displayOperator !== null) ? `${firstOperand} ${displayOperator} ${currentInput}` : currentInput;
                    currentEquationDisplay.textContent = currentEquationLine;
                    return;
                case 'deg':
                    return;
                default:
                    return;
            }

            if (processedResult === 'Error') {
                display.value = 'Error';
                currentInput = '0';
                handleClear();
            } else {
                display.value = String(processedResult);
                currentInput = String(processedResult);
                currentEquationLine = String(processedResult);
                currentEquationDisplay.textContent = currentEquationLine;
                firstOperand = processedResult;
                waitingForSecondOperand = true;
            }
            return;
        }
    });
});

function handleClear() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    displayOperator = null;
    waitingForSecondOperand = false;
    previousCalculationLine = '';
    currentEquationLine = '';
    display.value = currentInput;
    previousCalculationDisplay.textContent = '';
    currentEquationDisplay.textContent = '';
    isSecondFunctionActive = false;
    secondButton.classList.remove('active');
    toggleScientificButtonsText();
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '.': '.',
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷',
        'Enter': '=',
        '=': '=',
        'Backspace': '⌫',
        'Escape': 'AC',
        'c': 'AC'
    };
    
    const buttonText = keyMap[key];
    if (buttonText) {
        buttons.forEach(button => {
            let targetButton = null;
            if (button.textContent.trim() === buttonText) {
                targetButton = button;
            } else if (button.dataset && button.dataset.primaryText === buttonText) {
                targetButton = button;
            } else if (button.dataset && button.dataset.secondaryText === buttonText) {
                targetButton = button;
            }

            if (targetButton) {
                targetButton.click();
                if (targetButton.id === 'secondBtn') {
                    isSecondFunctionActive = !isSecondFunctionActive;
                    secondButton.classList.toggle('active', isSecondFunctionActive);
                    toggleScientificButtonsText();
                }
                return;
            }
        });
    }
});

function calculate(first, second, op) {
    if (op === '/' && second === 0) {
        return 'Error';
    }

    switch (op) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '*':
            return first * second;
        case '/':
            return first / second;
        case '^':
            return Math.pow(first, second);
        case 'yroot':
            if (first < 0 && second % 2 === 0) return 'Error';
            return Math.pow(first, 1 / second);
        default:
            return second;
    }
}
