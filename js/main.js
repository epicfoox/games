/**
 * Main JavaScript file for the Games Hub
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get game navigation elements
    const gameLinks = document.querySelectorAll('.game-link');
    
    // Add event listeners to game links
    gameLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the game ID from the data attribute
            const gameId = link.getAttribute('data-game');
            
            // Load the selected game
            if (gameManager.loadGame(gameId)) {
                // Update active link
                gameLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Load the default game (Plinko) on page load
    gameManager.loadGame('plinko');
});