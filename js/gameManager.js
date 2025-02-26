/**
 * Game Manager Class
 * Manages the loading and unloading of different games
 */
class GameManager {
    constructor() {
        this.games = {};
        this.currentGame = null;
        this.gameContainer = document.getElementById('game-container');
    }
    
    /**
     * Register a new game with the manager
     * @param {string} gameId - Unique identifier for the game
     * @param {object} gameClass - Reference to the game class
     */
    registerGame(gameId, gameClass) {
        this.games[gameId] = gameClass;
        console.log(`Game "${gameId}" registered`);
    }
    
    /**
     * Load a specific game
     * @param {string} gameId - ID of the game to load
     */
    loadGame(gameId) {
        if (!this.games[gameId]) {
            console.error(`Game "${gameId}" not found!`);
            return false;
        }
        
        // Unload current game if exists
        if (this.currentGame) {
            this.unloadCurrentGame();
        }
        
        // Create and initialize the new game
        try {
            this.currentGame = new this.games[gameId](this.gameContainer);
            this.currentGame.init();
            console.log(`Game "${gameId}" loaded successfully`);
            return true;
        } catch (error) {
            console.error(`Error loading game "${gameId}":`, error);
            return false;
        }
    }
    
    /**
     * Unload the currently active game
     */
    unloadCurrentGame() {
        if (this.currentGame && typeof this.currentGame.destroy === 'function') {
            this.currentGame.destroy();
            this.currentGame = null;
            this.gameContainer.innerHTML = '';
            console.log('Current game unloaded');
        }
    }
    
    /**
     * Get list of available games
     * @returns {string[]} Array of game IDs
     */
    getAvailableGames() {
        return Object.keys(this.games);
    }
}

// Create global game manager instance
const gameManager = new GameManager();