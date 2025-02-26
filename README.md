# Games Hub

A web-based arcade platform that currently features a PLINKO game and is designed to easily add more games in the future.

## Project Overview

This project is a browser-based game platform that uses HTML5, CSS3, and vanilla JavaScript to create an extensible arcade system. The architecture is designed to make adding new games simple while maintaining consistency in the user interface.

## Features

- **Modular Game Architecture**: Each game is self-contained and can be easily added to the platform
- **Game Manager**: Centralized system for registering, loading, and switching between games
- **Canvas-based Rendering**: Uses HTML5 Canvas for smooth game graphics
- **Responsive Design**: Adapts to different screen sizes

## Current Games

### Plinko
A physics-based game where discs fall through pegs and land in scoring slots. Features include:
- Real-time physics with gravity and collision detection
- Interactive disc dropping mechanism
- Visual scoring system
- Reset functionality

## Project Structure

```
games/
├── index.html         # Main HTML entry point
├── css/
│   └── styles.css     # Global and game-specific styles
├── js/
│   ├── gameManager.js # Core game management system
│   └── main.js        # Main application initialization
├── games/             # Individual games folder
│   └── plinko/        # Plinko game files
│       └── plinko.js  # Plinko game implementation
└── assets/            # Shared image assets and resources
```

## How It Works

1. The `GameManager` class handles registering, loading, and unloading games
2. Each game is implemented as a class that follows a standard interface with `init()` and `destroy()` methods
3. Games are registered with the GameManager using a unique identifier
4. The navigation system allows users to switch between available games

## Adding New Games

To add a new game to the platform:

1. Create a new folder under the `games/` directory with your game name
2. Implement your game as a class with at least the following methods:
   - `constructor(container)`: Initialize with the container element
   - `init()`: Set up the game
   - `destroy()`: Clean up resources
3. Register your game with the GameManager:
   ```javascript
   gameManager.registerGame('your-game-id', YourGameClass);
   ```
4. Add a navigation link in index.html:
   ```html
   <li><a href="#" class="game-link" data-game="your-game-id">Your Game Name</a></li>
   ```
5. Include your game script in index.html:
   ```html
   <script src="games/your-game/your-game.js"></script>
   ```

## Running the Project

Simply open the `index.html` file in a modern web browser to start playing.