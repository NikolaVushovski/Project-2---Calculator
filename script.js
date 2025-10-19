document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const scientificToggle = document.getElementById('scientific-toggle');
    const scientificButtons = document.getElementById('scientific-buttons');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    let currentExpression = '';
    let history = [];
    let isScientificMode = false;
    
    // Theme switching
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('calculator-theme', theme);
        });
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('calculator-theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // Button click handlers
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            
            if (value === 'C') {
                currentExpression = '';
                display.value = '';
            } else if (value === 'CE') {
                currentExpression = currentExpression.slice(0, -1);
                display.value = currentExpression;
            } else if (value === '=') {
                calculate();
            } else {
                currentExpression += value;
                display.value = currentExpression;
            }
        });
    });
    
    // Scientific mode toggle
    scientificToggle.addEventListener('click', function() {
        isScientificMode = !isScientificMode;
        scientificButtons.classList.toggle('show', isScientificMode);
        this.textContent = isScientificMode ? 'Basic' : 'Scientific';
    });
    
    // History item click
    historyList.addEventListener('click', function(e) {
        if (e.target.classList.contains('history-item')) {
            const expression = e.target.getAttribute('data-expression');
            currentExpression = expression;
            display.value = expression;
        }
    });
    
    // Clear history
    clearHistoryBtn.addEventListener('click', function() {
        history = [];
        updateHistoryDisplay();
    });
    
    function calculate() {
        try {
            let result = evaluateExpression(currentExpression);
            display.value = result;
            addToHistory(currentExpression, result);
            currentExpression = result.toString();
        } catch (error) {
            display.value = 'Error';
            currentExpression = '';
        }
    }
    
    function evaluateExpression(expr) {
        // Replace scientific functions with JavaScript equivalents
        expr = expr.replace(/sin\$/g, 'Math.sin(');
        expr = expr.replace(/cos\$/g, 'Math.cos(');
        expr = expr.replace(/tan\$/g, 'Math.tan(');
        expr = expr.replace(/log\$/g, 'Math.log10(');
        expr = expr.replace(/ln\$/g, 'Math.log(');
        expr = expr.replace(/sqrt\$/g, 'Math.sqrt(');
        expr = expr.replace(/pi/g, 'Math.PI');
        expr = expr.replace(/e/g, 'Math.E');
        
        // Handle power operations
        expr = expr.replace(/\^/g, '**');
        
        // Handle factorial
        expr = expr.replace(/(\d+)!/g, 'factorial($1)');
        
        // Evaluate the expression
        return eval(expr);
    }
    
    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    }
    
    function addToHistory(expression, result) {
        history.unshift({ expression, result });
        if (history.length > 50) {
            history.pop();
        }
        updateHistoryDisplay();
        localStorage.setItem('calculator-history', JSON.stringify(history));
    }
    
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.setAttribute('data-expression', item.expression);
            historyItem.textContent = `${item.expression} = ${item.result}`;
            historyList.appendChild(historyItem);
        });
    }
    
    // Load saved history
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        if (key >= '0' && key <= '9') {
            currentExpression += key;
            display.value = currentExpression;
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            currentExpression += key;
            display.value = currentExpression;
        } else if (key === '.') {
            currentExpression += '.';
            display.value = currentExpression;
        } else if (key === 'Enter') {
            calculate();
        } else if (key === 'Backspace') {
            currentExpression = currentExpression.slice(0, -1);
            display.value = currentExpression;
        } else if (key === 'Escape') {
            currentExpression = '';
            display.value = '';
        }
    });
});