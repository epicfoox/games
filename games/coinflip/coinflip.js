/**
 * Coin Flip Game Class
 * A simple game where players guess if the next coin flip will be heads or tails
 */
class CoinFlipGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.streak = 0;
        this.lastResult = null;
        this.isFlipping = false;
        this.gameElements = null;
    }

    /**
     * Initialize the game
     */
    init() {
        // Create game elements
        this.createGameElements();
        
        // Add event listeners
        this.addEventListeners();
        
        console.log('Coin Flip game initialized');
    }
    
    /**
     * Create HTML elements for the game
     */
    createGameElements() {
        // Create game container
        const gameDiv = document.createElement('div');
        gameDiv.className = 'coin-flip-game';
        
        // Create score display
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'score-display';
        
        const scoreTitle = document.createElement('h2');
        scoreTitle.textContent = 'Score';
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'score-value';
        scoreValue.textContent = '0';
        scoreValue.id = 'score-value';
        
        const streakSpan = document.createElement('span');
        streakSpan.className = 'streak';
        streakSpan.id = 'streak';
        streakSpan.textContent = '';
        
        scoreDiv.appendChild(scoreTitle);
        scoreDiv.appendChild(scoreValue);
        scoreDiv.appendChild(streakSpan);
        
        // Create coin display
        const coinContainer = document.createElement('div');
        coinContainer.className = 'coin-container';
        
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.id = 'coin';
        
        const coinFront = document.createElement('div');
        coinFront.className = 'coin-side heads';
        coinFront.textContent = 'H';
        
        const coinBack = document.createElement('div');
        coinBack.className = 'coin-side tails';
        coinBack.textContent = 'T';
        
        coin.appendChild(coinFront);
        coin.appendChild(coinBack);
        coinContainer.appendChild(coin);
        
        // Create result message
        const resultMessage = document.createElement('div');
        resultMessage.className = 'result-message';
        resultMessage.id = 'result-message';
        
        // Create guess buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'guess-buttons';
        
        const headsButton = document.createElement('button');
        headsButton.textContent = 'Heads';
        headsButton.id = 'guess-heads';
        headsButton.className = 'guess-button';
        
        const tailsButton = document.createElement('button');
        tailsButton.textContent = 'Tails';
        tailsButton.id = 'guess-tails';
        tailsButton.className = 'guess-button';
        
        buttonsDiv.appendChild(headsButton);
        buttonsDiv.appendChild(tailsButton);
        
        // Append all elements to the game container
        gameDiv.appendChild(scoreDiv);
        gameDiv.appendChild(coinContainer);
        gameDiv.appendChild(resultMessage);
        gameDiv.appendChild(buttonsDiv);
        
        this.container.appendChild(gameDiv);
        
        // Save references to elements we'll need to update
        this.gameElements = {
            scoreValue: document.getElementById('score-value'),
            streak: document.getElementById('streak'),
            coin: document.getElementById('coin'),
            resultMessage: document.getElementById('result-message')
        };
    }

    /**
     * Add event listeners for game controls
     */
    addEventListeners() {
        const headsButton = document.getElementById('guess-heads');
        const tailsButton = document.getElementById('guess-tails');
        
        headsButton.addEventListener('click', () => {
            this.makeGuess('heads');
        });
        
        tailsButton.addEventListener('click', () => {
            this.makeGuess('tails');
        });
    }
    
    /**
     * Make a guess and flip the coin
     * @param {string} guess - The player's guess ('heads' or 'tails')
     */
    makeGuess(guess) {
        if (this.isFlipping) return;
        
        this.isFlipping = true;
        this.gameElements.resultMessage.textContent = '';
        
        // Generate random result
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        
        // Start the coin flip animation
        this.gameElements.coin.classList.add('flipping');
        
        // Remove previous results class if any
        this.gameElements.coin.classList.remove('heads-result', 'tails-result');
        
        setTimeout(() => {
            // Stop the animation and show the result
            this.gameElements.coin.classList.remove('flipping');
            this.gameElements.coin.classList.add(`${result}-result`);
            
            // Check if the guess was correct
            const correct = guess === result;
            
            // Update score and streak
            if (correct) {
                this.score++;
                this.streak++;
                this.gameElements.resultMessage.textContent = 'Correct!';
                this.gameElements.resultMessage.className = 'result-message correct';
            } else {
                this.streak = 0;
                this.gameElements.resultMessage.textContent = 'Wrong!';
                this.gameElements.resultMessage.className = 'result-message wrong';
            }
            
            // Update UI
            this.gameElements.scoreValue.textContent = this.score;
            this.updateStreakDisplay();
            
            // Store the result
            this.lastResult = result;
            
            // Re-enable guessing
            this.isFlipping = false;
        }, 1500);
    }
    
    /**
     * Update the streak display
     */
    updateStreakDisplay() {
        if (this.streak > 1) {
            this.gameElements.streak.textContent = `Streak: ${this.streak}`;
        } else {
            this.gameElements.streak.textContent = '';
        }
    }
    
    /**
     * Clean up resources when game is destroyed
     */
    destroy() {
        // Remove all game elements
        this.container.innerHTML = '';
        console.log('Coin Flip game destroyed');
    }
}

// Register the game with the game manager
gameManager.registerGame('coinflip', CoinFlipGame);