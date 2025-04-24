// Game variables
let score = 0;
let timeLeft = 30;
let gameActive = false;
let clickPower = 1;
let autoClickers = 0;
let autoClickerInterval;
let gameInterval;
let hamsterCount = 0;
let maxHamsters = 5;

// DOM elements
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const upgradeClickBtn = document.getElementById('upgradeClick');
const upgradeAutoBtn = document.getElementById('upgradeAuto');
const clickPowerElement = document.getElementById('clickPower');
const autoClickersElement = document.getElementById('autoClickers');

// Prices
let clickPowerPrice = 10;
let autoClickerPrice = 50;

// Start game
startBtn.addEventListener('click', startGame);

// Upgrade buttons
upgradeClickBtn.addEventListener('click', () => {
    if (score >= clickPowerPrice) {
        score -= clickPowerPrice;
        clickPower++;
        clickPowerPrice = Math.floor(clickPowerPrice * 1.5);
        updateUI();
        updateUpgradeButtons();
    }
});

upgradeAutoBtn.addEventListener('click', () => {
    if (score >= autoClickerPrice) {
        score -= autoClickerPrice;
        autoClickers++;
        autoClickerPrice = Math.floor(autoClickerPrice * 1.8);
        updateUI();
        updateUpgradeButtons();
        
        // Start auto-clicker if not already running
        if (!autoClickerInterval) {
            startAutoClickers();
        }
    }
});

function startGame() {
    score = 0;
    timeLeft = 30;
    gameActive = true;
    clickPower = 1;
    autoClickers = 0;
    clickPowerPrice = 10;
    autoClickerPrice = 50;
    
    startBtn.disabled = true;
    updateUI();
    updateUpgradeButtons();
    
    // Clear any existing hamsters
    gameArea.innerHTML = '';
    hamsterCount = 0;
    
    // Spawn initial hamsters
    spawnHamsters();
    
    // Start game timer
    gameInterval = setInterval(() => {
        timeLeft--;
        updateUI();
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    // Start auto-clickers if any
    if (autoClickers > 0) {
        startAutoClickers();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(autoClickerInterval);
    autoClickerInterval = null;
    startBtn.disabled = false;
    
    // Remove all hamsters
    gameArea.innerHTML = '';
    hamsterCount = 0;
    
    alert(`Игра окончена! Ваш счет: ${score}`);
}

function spawnHamsters() {
    if (!gameActive) return;
    
    // Spawn new hamsters if we have less than max
    if (hamsterCount < maxHamsters) {
        const hamster = document.createElement('div');
        hamster.className = 'hamster';
        
        // Random position
        const maxX = gameArea.clientWidth - 60;
        const maxY = gameArea.clientHeight - 60;
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        
        hamster.style.left = `${x}px`;
        hamster.style.top = `${y}px`;
        
        // Click handler
        hamster.addEventListener('click', () => {
            if (gameActive) {
                // Add to score
                addScore(clickPower);
                
                // Animate
                hamster.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    hamster.style.transform = 'scale(1)';
                }, 100);
                
                // Move to new position
                setTimeout(() => {
                    const newX = Math.floor(Math.random() * maxX);
                    const newY = Math.floor(Math.random() * maxY);
                    hamster.style.left = `${newX}px`;
                    hamster.style.top = `${newY}px`;
                }, 50);
            }
        });
        
        gameArea.appendChild(hamster);
        hamsterCount++;
        
        // Set random movement
        if (Math.random() > 0.7) {
            moveHamsterRandomly(hamster, maxX, maxY);
        }
    }
    
    // Schedule next spawn
    setTimeout(spawnHamsters, 1000 + Math.random() * 2000);
}

function moveHamsterRandomly(hamster, maxX, maxY) {
    if (!gameActive) return;
    
    const duration = 2000 + Math.random() * 3000;
    const newX = Math.floor(Math.random() * maxX);
    const newY = Math.floor(Math.random() * maxY);
    
    hamster.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
    hamster.style.left = `${newX}px`;
    hamster.style.top = `${newY}px`;
    
    setTimeout(() => {
        moveHamsterRandomly(hamster, maxX, maxY);
    }, duration);
}

function startAutoClickers() {
    if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
    }
    
    autoClickerInterval = setInterval(() => {
        if (gameActive && hamsterCount > 0) {
            const hamsters = document.querySelectorAll('.hamster');
            const hits = Math.min(autoClickers, hamsters.length);
            
            for (let i = 0; i < hits; i++) {
                const hamster = hamsters[Math.floor(Math.random() * hamsters.length)];
                hamster.click();
            }
        }
    }, 1000);
}

function addScore(amount) {
    score += amount;
    updateUI();
    updateUpgradeButtons();
}

function updateUI() {
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    clickPowerElement.textContent = clickPower;
    autoClickersElement.textContent = autoClickers;
}

function updateUpgradeButtons() {
    upgradeClickBtn.textContent = `Улучшить удар (+${clickPower}) - ${clickPowerPrice}`;
    upgradeAutoBtn.textContent = `Купить автоудар (${autoClickers}) - ${autoClickerPrice}`;
    
    upgradeClickBtn.disabled = score < clickPowerPrice || !gameActive;
    upgradeAutoBtn.disabled = score < autoClickerPrice || !gameActive;
}