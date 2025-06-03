class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) return;

        if (isNaN(current)) {
            this.currentOperand = prev.toString();
            this.operation = undefined;
            this.previousOperand = '';
            return;
        }

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const allClearButton = document.querySelector('[data-action="clear"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const themeToggle = document.getElementById('theme-toggle');

// Calculator instance
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 150);
    });
});

operationButtons.forEach(button => {
    if (button.dataset.action !== 'calculate' && 
        button.dataset.action !== 'delete' && 
        button.dataset.action !== 'clear') {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.textContent);
            calculator.updateDisplay();
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 150);
        });
    }
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    equalsButton.classList.add('active');
    setTimeout(() => equalsButton.classList.remove('active'), 150);
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    allClearButton.classList.add('active');
    setTimeout(() => allClearButton.classList.remove('active'), 150);
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    deleteButton.classList.add('active');
    setTimeout(() => deleteButton.classList.remove('active'), 150);
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', document.body.getAttribute('data-theme'));
});

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let operation;
        switch (e.key) {
            case '+': operation = '+'; break;
            case '-': operation = '−'; break;
            case '*': operation = '×'; break;
            case '/': operation = '÷'; break;
        }
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});

// Initial display update
calculator.updateDisplay();
