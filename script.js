const display = document.querySelector('.calculator-display');
const buttons = document.querySelectorAll('.button');

let currentInput = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

function calculate(first, second, op) {
    switch(op){
        case '+':
            return first+second;
        case '-':
            return first-second;
        case '*':
            return first*second;
        case '/':
            return first/second;
        case '^':
            return Math.pow(first,second);
        default:
            return second;
    }
}

buttons.forEach(button => {
    button.addEventListener('click',()=> {
        const buttonText = button.textContent;
        const buttonClassList = button.classList;

        if(buttonClassList.contains('number')) {
            if(waitingForSecondOperand===true){
                currentInput = buttonText;
                waitingForSecondOperand = false;
            } else {
                currentInput = currentInput==='0'? buttonText:currentInput + buttonText;
            }
            display.value = currentInput;
            return;
        }

        if(buttonClassList.contains('operator')){
            if(firstOperand===null){
                firstOperand = parseFloat(currentInput);
            } else if (operand){
                const result = calculate(firstOperand, parseFloat(currentInput), operator);
                currentInput = String(result);
                display.value = currentInput;
                firstOperand = result;
            }
            operator = buttonText === '÷'?'/': buttonText === '×'?'*': buttonText;
            waitingForSecondOperand = true;
            return;
        }

        if(buttonClassList.contains('equals')){
            if(firstOperand===null || operator===null || waitingForSecondOperand){
                return;
            }  
            const result = calculate(firstOperand, parseFloat(currentInput), operator);
            display.value = String(result);
            currentInput = String(result);
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            return;
        }

        if(buttonClassList.contains('clear')){
            currentInput = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            display.value = currentInput;
            return;
        }

        if(buttonClassList.contains('backspace')){
            currentInput = currentInput.slice(0,-1);
            if (currentInput===''){
                currentInput = '0';
                return;
            }
        }

        if(buttonClassList.contains('function') || buttonClassList.contains('constant')){
            if (buttonText==='sin'){
                display.value = Math.sin(parseFloat(currentInput)*Math.PI/180);
                currentInput = String(display.value);
            } else if (buttonText==='cos'){
                display.value = Math.cos(parseFloat(currentInput)*Math.PI/180);
                currentInput = String(display.value);
            } else if (buttonText==='tan'){
                display.value = Math.tan(parseFloat(currentInput)*Math.PI/180);
                currentInput = String(display.value);
            } else if (buttonText==='lg'){
                display.value = Math.log10(parseFloat(currentInput));
                currentInput = String(display.value);
            } else if (buttonText==='In'){
                display.value = Math.log(parseFloat(currentInput));
                currentInput = String(display.value);
            } else if (buttonText==='x!'){
                let num = parseFloat(currentInput);
                if(num<0 || !Number.isInteger(num)){
                    display.value = 'Error';
                    currentInput = '0';
                } else {
                    let fact = 1;
                    for(let i=2; i<=num; i++) fact*=i;
                    display.value = fact;
                    currentInput = String(fact);
                }
            } else if(buttonText=='x^y'){
                if(firstOperand===null){
                    firstOperand = parseFloat(currentInput);
                } else if(operator){
                    const result = calculate(firstOperand, parseFloat(currentInput), operator);
                    currentInput = String(result);
                    display.value = currentInput;
                    firstOperand = result;
                }
                operator = '^';
                waitingForSecondOperand = true;
            } else if(buttonText==='√x'){
                display.value = Math.sqrt(parseFloat(currentInput));
                currentInput = String(display.value);
            } else if(buttonText==='1/x'){
                const num = parseFloat(currentInput);
                if(num===0){
                    display.value = 'Error';
                    currentInput = '0';
                } else {
                    display.value = 1/num;
                    currentInput = String(display.value)
                }
            } else if(buttonText==='&pi') {
                currentInput = String(Math.PI);
                display.value = currentInput;
            } else if(buttonText==='e') {
                currentInput = String(Math.E);
                display.value = currentInput;
            } else if(buttonText==='(') {
                currentInput = currentInput === '0'? buttonText: currentInput + buttonText;
                display.value = currentInput;
            }
            return;
        }
    });
});
