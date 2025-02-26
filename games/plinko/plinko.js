/**
 * Plinko Game Class
 * A physics-based game where discs fall through pegs to land in slots
 */
class PlinkoGame {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.width = 800;
        this.height = 600;
        this.pegs = [];
        this.discs = [];
        this.slots = [];
        this.animationFrameId = null;
        this.lastTimestamp = 0;
        this.gravity = 0.2;
        this.pegRadius = 8;
        this.discRadius = 15;
        this.slotWidth = 80;
        this.slotHeight = 60;
        this.dropX = this.width / 2;
    }

    /**
     * Initialize the game
     */
    init() {
        // Create game elements
        this.createGameElements();
        
        // Generate pegs
        this.generatePegs();
        
        // Generate slots at the bottom
        this.generateSlots();
        
        // Add event listeners
        this.addEventListeners();
        
        // Start game loop
        this.lastTimestamp = performance.now();
        this.gameLoop(this.lastTimestamp);
        
        console.log('Plinko game initialized');
    }
    
    /**
     * Create HTML elements for the game
     */
    createGameElements() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.className = 'game-canvas plinko-board';
        this.ctx = this.canvas.getContext('2d');
        
        // Create control panel
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'plinko-controls';
        
        const dropButton = document.createElement('button');
        dropButton.textContent = 'Drop Disc';
        dropButton.id = 'drop-disc';
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Game';
        resetButton.id = 'reset-game';
        
        controlsDiv.appendChild(dropButton);
        controlsDiv.appendChild(resetButton);
        
        // Append elements to container
        this.container.appendChild(this.canvas);
        this.container.appendChild(controlsDiv);
    }

    /**
     * Add event listeners for game controls
     */
    addEventListeners() {
        const dropButton = document.getElementById('drop-disc');
        const resetButton = document.getElementById('reset-game');
        
        // Drop disc button
        dropButton.addEventListener('click', () => {
            this.dropDisc();
        });
        
        // Reset game button
        resetButton.addEventListener('click', () => {
            this.resetGame();
        });
        
        // Allow moving disc drop position with mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            
            // Constrain drop position to canvas width
            this.dropX = Math.max(this.discRadius, Math.min(mouseX, this.width - this.discRadius));
            
            // Redraw if no animation is running
            if (this.discs.length === 0) {
                this.render();
            }
        });
        
        // Drop disc on canvas click
        this.canvas.addEventListener('click', () => {
            this.dropDisc();
        });
    }
    
    /**
     * Generate pegs in a triangular pattern
     */
    generatePegs() {
        const rows = 8;
        const pegSpacing = 60;
        const startY = 120;
        
        for (let row = 0; row < rows; row++) {
            const pegsInRow = row + 5;
            const rowWidth = (pegsInRow - 1) * pegSpacing;
            const startX = (this.width - rowWidth) / 2;
            
            for (let i = 0; i < pegsInRow; i++) {
                this.pegs.push({
                    x: startX + i * pegSpacing,
                    y: startY + row * pegSpacing,
                    radius: this.pegRadius
                });
            }
        }
    }
    
    /**
     * Generate slots at the bottom of the board
     */
    generateSlots() {
        const numSlots = 9;
        const totalWidth = numSlots * this.slotWidth;
        const startX = (this.width - totalWidth) / 2;
        
        for (let i = 0; i < numSlots; i++) {
            const points = i === 0 ? 1 : i === numSlots - 1 ? 1 : i;
            
            this.slots.push({
                x: startX + i * this.slotWidth,
                y: this.height - this.slotHeight,
                width: this.slotWidth,
                height: this.slotHeight,
                points: points
            });
        }
    }
    
    /**
     * Drop a new disc at the current dropX position
     */
    dropDisc() {
        this.discs.push({
            x: this.dropX,
            y: 50,
            radius: this.discRadius,
            velocityX: 0,
            velocityY: 0
        });
    }
    
    /**
     * Reset the game by removing all discs
     */
    resetGame() {
        this.discs = [];
    }
    
    /**
     * Main game loop
     * @param {number} timestamp - Current time in milliseconds
     */
    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = (timestamp - this.lastTimestamp) / 16.67; // Normalize to ~60fps
        this.lastTimestamp = timestamp;
        
        // Update physics
        this.update(deltaTime);
        
        // Render game
        this.render();
        
        // Continue loop
        this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }
    
    /**
     * Update game physics
     * @param {number} deltaTime - Time since last update in normalized units
     */
    update(deltaTime) {
        // Apply gravity and collision to each disc
        for (let i = this.discs.length - 1; i >= 0; i--) {
            const disc = this.discs[i];
            
            // Apply gravity
            disc.velocityY += this.gravity * deltaTime;
            
            // Update position
            disc.x += disc.velocityX * deltaTime;
            disc.y += disc.velocityY * deltaTime;
            
            // Boundary collision (sides)
            if (disc.x - disc.radius < 0) {
                disc.x = disc.radius;
                disc.velocityX = -disc.velocityX * 0.7;
            } else if (disc.x + disc.radius > this.width) {
                disc.x = this.width - disc.radius;
                disc.velocityX = -disc.velocityX * 0.7;
            }
            
            // Collision with pegs
            for (const peg of this.pegs) {
                const dx = disc.x - peg.x;
                const dy = disc.y - peg.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = disc.radius + peg.radius;
                
                if (distance < minDistance) {
                    // Calculate collision normal
                    const nx = dx / distance;
                    const ny = dy / distance;
                    
                    // Move disc outside of peg
                    const depthX = nx * (minDistance - distance);
                    const depthY = ny * (minDistance - distance);
                    disc.x += depthX;
                    disc.y += depthY;
                    
                    // Reflect velocity with some energy loss
                    const dotProduct = disc.velocityX * nx + disc.velocityY * ny;
                    disc.velocityX = (disc.velocityX - 2 * dotProduct * nx) * 0.8;
                    disc.velocityY = (disc.velocityY - 2 * dotProduct * ny) * 0.8;
                }
            }
            
            // Check if disc is in a slot at the bottom
            if (disc.y + disc.radius > this.height - this.slotHeight) {
                for (const slot of this.slots) {
                    if (disc.x > slot.x && disc.x < slot.x + slot.width) {
                        // Center the disc in the slot
                        disc.velocityX *= 0.9;
                        disc.x += (slot.x + slot.width / 2 - disc.x) * 0.1;
                        
                        // If disc is at the bottom, remove it
                        if (disc.y + disc.radius > this.height) {
                            this.discs.splice(i, 1);
                            console.log(`Disc landed in slot with ${slot.points} points!`);
                            break;
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw slots
        this.ctx.fillStyle = '#333';
        for (const slot of this.slots) {
            this.ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
            
            // Draw slot points
            this.ctx.fillStyle = 'white';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(slot.points, slot.x + slot.width / 2, slot.y + 30);
            this.ctx.fillStyle = '#333';
        }
        
        // Draw pegs
        this.ctx.fillStyle = '#ddd';
        for (const peg of this.pegs) {
            this.ctx.beginPath();
            this.ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw discs
        this.ctx.fillStyle = '#f39c12';
        for (const disc of this.discs) {
            this.ctx.beginPath();
            this.ctx.arc(disc.x, disc.y, disc.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw drop indicator
        this.ctx.fillStyle = 'rgba(243, 156, 18, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(this.dropX, 50, this.discRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Clean up resources when game is destroyed
     */
    destroy() {
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove event listeners
        const dropButton = document.getElementById('drop-disc');
        const resetButton = document.getElementById('reset-game');
        
        if (dropButton) dropButton.remove();
        if (resetButton) resetButton.remove();
        
        console.log('Plinko game destroyed');
    }
}

// Register the game with the game manager
gameManager.registerGame('plinko', PlinkoGame);