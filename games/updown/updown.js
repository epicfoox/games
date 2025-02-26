/**
 * Up/Down Card Game Class
 * A game where players guess if the next card will be higher or lower than the current card
 */
class UpDownGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.currentCard = null;
        this.nextCard = null;
        this.deck = [];
        this.isAnimating = false;
        this.gameElements = null;
        this.gameOver = false;
        this.cardsLeft = 0;
    }

    /**
     * Initialize the game
     */
    init() {
        // Create game elements
        this.createGameElements();
        
        // Initialize a new game
        this.startNewGame();
        
        // Add event listeners
        this.addEventListeners();
        
        console.log('Up/Down game initialized');
    }
    
    /**
     * Create HTML elements for the game
     */
    createGameElements() {
        // Create wrapper div to ensure proper centering
        const gameWrapper = document.createElement('div');
        gameWrapper.className = 'game-wrapper';
        gameWrapper.style.width = '100%';
        gameWrapper.style.display = 'flex';
        gameWrapper.style.justifyContent = 'center';
        gameWrapper.style.alignItems = 'center';
        gameWrapper.style.flexDirection = 'column';
        
        // Create game container
        const gameDiv = document.createElement('div');
        gameDiv.className = 'updown-game';
        
        // Create score and deck info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'updown-info';
        
        const scoreContainer = document.createElement('div');
        scoreContainer.className = 'updown-score';
        
        const scoreLabel = document.createElement('span');
        scoreLabel.textContent = 'Score: ';
        
        const scoreValue = document.createElement('span');
        scoreValue.id = 'updown-score-value';
        scoreValue.textContent = '0';
        
        scoreContainer.appendChild(scoreLabel);
        scoreContainer.appendChild(scoreValue);
        
        const deckContainer = document.createElement('div');
        deckContainer.className = 'updown-deck-info';
        
        const deckLabel = document.createElement('span');
        deckLabel.textContent = 'Cards left: ';
        
        const deckValue = document.createElement('span');
        deckValue.id = 'updown-cards-left';
        deckValue.textContent = '51';
        
        deckContainer.appendChild(deckLabel);
        deckContainer.appendChild(deckValue);
        
        infoDiv.appendChild(scoreContainer);
        infoDiv.appendChild(deckContainer);
        
        // Create card display area
        const cardArea = document.createElement('div');
        cardArea.className = 'updown-card-area';
        
        const currentCardContainer = document.createElement('div');
        currentCardContainer.className = 'updown-card-container';
        currentCardContainer.id = 'current-card-container';
        
        const nextCardContainer = document.createElement('div');
        nextCardContainer.className = 'updown-card-container';
        nextCardContainer.id = 'next-card-container';
        
        cardArea.appendChild(currentCardContainer);
        cardArea.appendChild(nextCardContainer);
        
        // Create message display
        const messageDisplay = document.createElement('div');
        messageDisplay.className = 'updown-message';
        messageDisplay.id = 'updown-message';
        
        // Create guess buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'updown-buttons';
        
        const higherButton = document.createElement('button');
        higherButton.textContent = 'UP';
        higherButton.id = 'guess-higher';
        higherButton.className = 'updown-button';
        
        const lowerButton = document.createElement('button');
        lowerButton.textContent = 'DOWN';
        lowerButton.id = 'guess-lower';
        lowerButton.className = 'updown-button';
        
        buttonsDiv.appendChild(higherButton);
        buttonsDiv.appendChild(lowerButton);
        
        // Create new game button (initially hidden)
        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'New Game';
        newGameButton.id = 'new-game';
        newGameButton.className = 'updown-button new-game';
        newGameButton.style.display = 'none';
        
        // Append all elements to the game container
        gameDiv.appendChild(infoDiv);
        gameDiv.appendChild(cardArea);
        gameDiv.appendChild(messageDisplay);
        gameDiv.appendChild(buttonsDiv);
        gameDiv.appendChild(newGameButton);
        
        // Append game div to wrapper
        gameWrapper.appendChild(gameDiv);
        
        // Append wrapper to container
        this.container.appendChild(gameWrapper);
        
        // Save references to elements we'll need to update
        this.gameElements = {
            scoreValue: document.getElementById('updown-score-value'),
            cardsLeft: document.getElementById('updown-cards-left'),
            currentCardContainer: document.getElementById('current-card-container'),
            nextCardContainer: document.getElementById('next-card-container'),
            message: document.getElementById('updown-message'),
            higherButton: document.getElementById('guess-higher'),
            lowerButton: document.getElementById('guess-lower'),
            newGameButton: document.getElementById('new-game')
        };
    }

    /**
     * Start a new game
     */
    startNewGame() {
        // Create and shuffle a new deck
        this.createDeck();
        this.shuffleDeck();
        
        // Reset game state
        this.score = 0;
        this.gameOver = false;
        this.isAnimating = false;
        this.cardsLeft = this.deck.length - 1; // One card will be drawn as current
        
        // Update UI
        this.gameElements.scoreValue.textContent = this.score;
        this.gameElements.cardsLeft.textContent = this.cardsLeft;
        this.gameElements.message.textContent = 'Will the next card be higher or lower?';
        this.gameElements.message.className = 'updown-message';
        
        // Show game buttons, hide new game button
        this.gameElements.higherButton.style.display = 'block';
        this.gameElements.lowerButton.style.display = 'block';
        this.gameElements.newGameButton.style.display = 'none';
        
        // Draw the first card
        this.currentCard = this.drawCard();
        this.renderCard(this.gameElements.currentCardContainer, this.currentCard);
        
        // Clear the next card area
        this.gameElements.nextCardContainer.innerHTML = '';
    }
    
    /**
     * Create a standard deck of 52 cards
     */
    createDeck() {
        this.deck = [];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        for (const suit of suits) {
            for (const value of values) {
                const numericValue = this.getCardValue(value);
                this.deck.push({
                    suit: suit,
                    value: value,
                    numericValue: numericValue
                });
            }
        }
    }
    
    /**
     * Shuffle the deck using Fisher-Yates algorithm
     */
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    /**
     * Get the numeric value of a card
     * @param {string} value - The card value (2-10, J, Q, K, A)
     * @returns {number} - The numeric value for comparison
     */
    getCardValue(value) {
        if (value === 'J') return 11;
        if (value === 'Q') return 12;
        if (value === 'K') return 13;
        if (value === 'A') return 14;
        return parseInt(value);
    }
    
    /**
     * Draw a card from the deck
     * @returns {Object} - The drawn card
     */
    drawCard() {
        if (this.deck.length === 0) return null;
        return this.deck.pop();
    }
    
    /**
     * Render a card in the specified container
     * @param {HTMLElement} container - The container to render the card in
     * @param {Object} card - The card to render
     */
    renderCard(container, card) {
        if (!card) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create card element
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.suit}`;
        
        // Create card content
        const cardTop = document.createElement('div');
        cardTop.className = 'card-value top';
        cardTop.textContent = card.value;
        
        const cardSuit = document.createElement('div');
        cardSuit.className = 'card-suit';
        cardSuit.textContent = this.getSuitSymbol(card.suit);
        
        const cardBottom = document.createElement('div');
        cardBottom.className = 'card-value bottom';
        cardBottom.textContent = card.value;
        
        // Append to card
        cardElement.appendChild(cardTop);
        cardElement.appendChild(cardSuit);
        cardElement.appendChild(cardBottom);
        
        // Append to container
        container.appendChild(cardElement);
    }
    
    /**
     * Get the symbol for a card suit
     * @param {string} suit - The card suit
     * @returns {string} - The suit symbol
     */
    getSuitSymbol(suit) {
        switch (suit) {
            case 'hearts': return '♥';
            case 'diamonds': return '♦';
            case 'clubs': return '♣';
            case 'spades': return '♠';
            default: return '';
        }
    }
    
    /**
     * Add event listeners for game controls
     */
    addEventListeners() {
        this.gameElements.higherButton.addEventListener('click', () => {
            this.makeGuess('higher');
        });
        
        this.gameElements.lowerButton.addEventListener('click', () => {
            this.makeGuess('lower');
        });
        
        this.gameElements.newGameButton.addEventListener('click', () => {
            this.startNewGame();
        });
    }
    
    /**
     * Make a guess if the next card will be higher or lower
     * @param {string} guess - The player's guess ('higher' or 'lower')
     */
    makeGuess(guess) {
        if (this.isAnimating || this.gameOver) return;
        this.isAnimating = true;
        
        // Draw the next card
        this.nextCard = this.drawCard();
        this.cardsLeft = this.deck.length;
        
        // Update cards left display
        this.gameElements.cardsLeft.textContent = this.cardsLeft;
        
        // Render the next card
        this.renderCard(this.gameElements.nextCardContainer, this.nextCard);
        
        // Determine if the guess was correct
        let isCorrect = false;
        if (guess === 'higher' && this.nextCard.numericValue > this.currentCard.numericValue) {
            isCorrect = true;
        } else if (guess === 'lower' && this.nextCard.numericValue < this.currentCard.numericValue) {
            isCorrect = true;
        } else if (this.nextCard.numericValue === this.currentCard.numericValue) {
            // If cards are equal, it's a draw - no points lost or gained
            this.gameElements.message.textContent = "It's a draw! Cards have the same value.";
            this.gameElements.message.className = 'updown-message draw';
            
            // After showing result, continue the game
            setTimeout(() => {
                this.currentCard = this.nextCard;
                this.renderCard(this.gameElements.currentCardContainer, this.currentCard);
                this.gameElements.nextCardContainer.innerHTML = '';
                this.gameElements.message.textContent = 'Will the next card be higher or lower?';
                this.gameElements.message.className = 'updown-message';
                this.isAnimating = false;
                
                // Check if game is over
                this.checkGameOver();
            }, 1500);
            
            return;
        }
        
        // Update score and display message
        if (isCorrect) {
            this.score++;
            this.gameElements.scoreValue.textContent = this.score;
            this.gameElements.message.textContent = 'Correct!';
            this.gameElements.message.className = 'updown-message correct';
        } else {
            this.gameElements.message.textContent = 'Wrong!';
            this.gameElements.message.className = 'updown-message wrong';
        }
        
        // After showing result, continue the game
        setTimeout(() => {
            this.currentCard = this.nextCard;
            this.renderCard(this.gameElements.currentCardContainer, this.currentCard);
            this.gameElements.nextCardContainer.innerHTML = '';
            
            // Check if the game is over
            if (this.checkGameOver()) {
                this.gameOver = true;
                this.gameElements.message.textContent = `Game over! Final score: ${this.score}`;
                this.gameElements.higherButton.style.display = 'none';
                this.gameElements.lowerButton.style.display = 'none';
                this.gameElements.newGameButton.style.display = 'block';
            } else {
                this.gameElements.message.textContent = 'Will the next card be higher or lower?';
                this.gameElements.message.className = 'updown-message';
                this.isAnimating = false;
            }
        }, 1500);
    }
    
    /**
     * Check if the game is over (no cards left)
     * @returns {boolean} - Whether the game is over
     */
    checkGameOver() {
        return this.cardsLeft === 0;
    }
    
    /**
     * Clean up resources when game is destroyed
     */
    destroy() {
        // Remove all game elements
        this.container.innerHTML = '';
        console.log('Up/Down game destroyed');
    }
}

// Register the game with the game manager
gameManager.registerGame('updown', UpDownGame);