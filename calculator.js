
const display = document.querySelector('.display');
const numberButtons = getAllNumberButtons(document.querySelectorAll('.button'));
const cleanDisplay = document.querySelector('.clean-button');
const operationButtons = document.querySelectorAll('.operation-button');
const perfomComputationButton = document.querySelector('.perform-computation-button');


function getAllNumberButtons(setOfElements) {
    let numberButtons = [];


    for (let i = 0; i < setOfElements.length; i++) {
        if (setOfElements[i].innerText > -1 && setOfElements[i].innerText < 10) {
            numberButtons.push(setOfElements[i]);
        }
    }
    return numberButtons;
}

function characterPrecedence(character) {
    if (character == '+' || character == '-') {
        return 1;
    }
    if (character == 'x' || character == '/' || character == '%') {
        return 2;
    }
    if (character == '^') {
        return 3;
    }
    return 0;
}


function isOperator(character) {
    if (character == '+' || character == '-' || character == 'x' || character == '%' || character == '/' || character == '^') {
        return true;
    }
    return false;
}

function associativity(character) {
    if (character == '^') {
        return 0;
    }
    return 1;
}


function convertInfixExpressionToPostfixExpression(infixExpression) {
    let stack = [];
    let stackTop = 0;
    let character = '';
    let resultExpression = [];
    let operand = '';

    for (let i = 0; i < infixExpression.length; i++) {
        character = infixExpression.charAt(i);

        if (character >= 0 || character <= 9) {
            operand += character;
        } else {
            operand = parseInt(operand);
            resultExpression.push(operand);
            operand = '';

            if (stackTop > 0 && characterPrecedence(character) > characterPrecedence(stack[stackTop - 1])) {
                stack.push(character)
                stackTop++;
            } else if (stack[stackTop - 1] == '(') {
                stack.push(character)
                stackTop++;
            } else {
                if (stack[stackTop - 1] == ')') {
                    while (stackTop > 0 && stack[stackTop - 1] != '(') {
                        resultExpression.push(stack[stackTop - 1]);
                        stackTop--;
                    }
                    stackTop--;
                } else if (stackTop > 0 && characterPrecedence(character) < characterPrecedence(stack[stackTop - 1])) {
                    while (stackTop > 0 && characterPrecedence(character) <= characterPrecedence(stack[stackTop - 1])) {
                        if (stack[stackTop - 1] == '(') {
                            break;
                        }
                        resultExpression.push(stack[stackTop - 1]);
                        stackTop--;
                    }
                } else if (stackTop > 0 && characterPrecedence(character) == characterPrecedence(stack[stackTop - 1])) {
                    if (associativity(character) == 1) {
                        resultExpression.push(stack[stackTop - 1]);
                        stackTop--;
                    }
                    stack[stackTop] = character;
                    stackTop++;
                } else if (stackTop == 0) {
                    stack[stackTop] = character;
                    stackTop++;
                }
            }
        }
    }

    if (operand != '') {
        resultExpression.push(parseInt(operand));
    }

    while (stackTop > 0) {
        resultExpression.push(stack[stackTop - 1]);
        stackTop--;
    }

    return resultExpression;
}


function computePostfixExpression(postfixExpression) {
    let result = 0;
    let stack = [];
    let stackTop = 0;
    console.log(postfixExpression);

    for (let i = 0; i < postfixExpression.length; i++) {
        if (!isOperator(postfixExpression[i])) {
            stack.push(postfixExpression[i])
            stackTop++;
        } else {
            if (postfixExpression[i] == '+') {
                result = stack[stackTop - 2] + stack[stackTop - 1];
                stackTop -= 2;
            } else if (postfixExpression[i] == '-') {
                result = stack[stackTop - 2] - stack[stackTop - 1];
                stackTop -= 2;
            } else if (postfixExpression[i] == 'x') {
                result = stack[stackTop - 2] * stack[stackTop - 1];
                stackTop -= 2;
            } else if (postfixExpression[i] == '/') {
                result = stack[stackTop - 2] / stack[stackTop - 1];
                stackTop -= 2;
            } else if (postfixExpression[i] == '^') {
                result = Math.pow(stack[stackTop - 2], stack[stackTop - 1]);
                stackTop -= 2;
            } else if (postfixExpression[i] == '%') {
                result = parseInt(stack[stackTop - 2]) % parseInt(stack[stackTop - 1]);
                stackTop -= 2;
            }
            stack[stackTop] = result;
            stackTop++;
        }
    }
    return stack[stackTop - 1];
}

numberButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        if (display.innerText == '0') {
            display.innerText = e.target.innerText;
        } else {
            display.innerText += e.target.innerText;
        }
    });
});


operationButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        if (display.innerText != '0') {
            display.innerText += e.target.innerText;
        }
    })
})


cleanDisplay.addEventListener('click', () => { display.innerText = '0'});


perfomComputationButton.addEventListener('click', (e) => {
    const infixExpression = display.innerText;
    console.log(infixExpression)
    const postfixExpression = convertInfixExpressionToPostfixExpression(infixExpression);
    
    const resultOfExpression = computePostfixExpression(postfixExpression);

    display.innerText = resultOfExpression;
})