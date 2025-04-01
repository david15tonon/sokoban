// Constantes et variables globales
const WALL = '#';
const FLOOR = '.';
const BOX = '$';
const TARGET = '+';
const BOX_ON_TARGET = '*';
const PLAYER = '@';
const PLAYER_ON_TARGET = '+';

let currentLevel = 0;
let playerPosition = { x: 0, y: 0 };
let gameMap = [];
let originalMap = [];
let moveCount = 0;

// Éléments du DOM
const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const movesDisplay = document.getElementById('moves-display');
const resetButton = document.getElementById('reset-btn');
const prevLevelButton = document.getElementById('prev-level');
const nextLevelButton = document.getElementById('next-level');

// Initialisation du jeu
function initGame() {
    loadLevel(currentLevel);
    
    // Écouteurs d'événements
    document.addEventListener('keydown', handleKeyPress);
    resetButton.addEventListener('click', resetLevel);
    prevLevelButton.addEventListener('click', () => changeLevel(-1));
    nextLevelButton.addEventListener('click', () => changeLevel(1));
}

// Charger un niveau
function loadLevel(levelIndex) {
    if (levelIndex < 0 || levelIndex >= levels.length) {
        return;
    }
    
    currentLevel = levelIndex;
    moveCount = 0;
    updateDisplay();
    
    // Copier la carte du niveau
    originalMap = levels[currentLevel].map.map(row => row);
    resetLevel();
}

// Réinitialiser le niveau actuel
function resetLevel() {
    gameMap = originalMap.map(row => row);
    playerPosition = { ...levels[currentLevel].startPosition };
    moveCount = 0;
    updateDisplay();
    renderMap();
}

// Mettre à jour l'affichage des informations
function updateDisplay() {
    levelDisplay.textContent = `Niveau: ${currentLevel + 1}`;
    movesDisplay.textContent = `Déplacements: ${moveCount}`;
    
    // Désactiver les boutons si nécessaire
    prevLevelButton.disabled = currentLevel === 0;
    nextLevelButton.disabled = currentLevel === levels.length - 1;
}

// Changer de niveau
function changeLevel(direction) {
    const newLevel = currentLevel + direction;
    if (newLevel >= 0 && newLevel < levels.length) {
        loadLevel(newLevel);
    }
}

// Rendre la carte du jeu
function renderMap() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${getMaxWidth()}, 40px)`;
    
    for (let y = 0; y < gameMap.length; y++) {
        const row = gameMap[y];
        for (let x = 0; x < row.length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            const char = row[x];
            
            switch (char) {
                case WALL:
                    cell.classList.add('wall');
                    break;
                case FLOOR:
                    cell.classList.add('floor');
                    break;
                case BOX:
                    cell.classList.add('floor');
                    cell.classList.add('box');
                    break;
                case TARGET:
                    cell.classList.add('floor');
                    cell.classList.add('target');
                    break;
                case BOX_ON_TARGET:
                    cell.classList.add('floor');
                    cell.classList.add('target');
                    cell.classList.add('box-on-target');
                    break;
                case PLAYER:
                case PLAYER_ON_TARGET:
                    if (char === PLAYER_ON_TARGET) {
                        cell.classList.add('target');
                    } else {
                        cell.classList.add('floor');
                    }
                    cell.classList.add('player');
                    break;
                default:
                    // Espace vide ou autre caractère
                    break;
            }
            
            gameBoard.appendChild(cell);
        }
    }
}

// Obtenir la largeur maximale de la carte
function getMaxWidth() {
    let maxWidth = 0;
    for (const row of gameMap) {
        maxWidth = Math.max(maxWidth, row.length);
    }
    return maxWidth;
}

// Obtenir le caractère à une position spécifique
function getCharAt(x, y) {
    if (y < 0 || y >= gameMap.length || x < 0 || x >= gameMap[y].length) {
        return null; // Hors limites
    }
    return gameMap[y][x];
}

// Définir un caractère à une position spécifique
function setCharAt(x, y, char) {
    if (y >= 0 && y < gameMap.length && x >= 0 && x < gameMap[y].length) {
        // Convertir la chaîne en tableau pour modification
        const rowChars = gameMap[y].split('');
        rowChars[x] = char;
        gameMap[y] = rowChars.join('');
    }
}

// Gérer l'appui sur les touches
function handleKeyPress(event) {
    let dx = 0;
    let dy = 0;
    
    // Touches fléchées ou ZQSD
    switch (event.key) {
        case 'ArrowUp':
        case 'z':
        case 'Z':
            dy = -1;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            dy = 1;
            break;
        case 'ArrowLeft':
        case 'q':
        case 'Q':
            dx = -1;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            dx = 1;
            break;
        case 'r':
        case 'R':
            resetLevel();
            return;
        default:
            return; // Ignorer les autres touches
    }
    
    movePlayer(dx, dy);
}

// Déplacer le joueur
function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    
    const currentCell = getCharAt(playerPosition.x, playerPosition.y);
    const targetCell = getCharAt(newX, newY);
    
    if (!targetCell) return; // Hors limites
    
    if (targetCell === WALL) return; // Ne peut pas traverser les murs
    
    if (targetCell === BOX || targetCell === BOX_ON_TARGET) {
        // Essayer de pousser la caisse
        const nextX = newX + dx;
        const nextY = newY + dy;
        const nextCell = getCharAt(nextX, nextY);
        
        // Vérifier si la caisse peut être poussée
        if (nextCell === FLOOR || nextCell === TARGET) {
            // Déplacer la caisse
            setCharAt(nextX, nextY, nextCell === FLOOR ? BOX : BOX_ON_TARGET);
            
            // Déplacer le joueur
            setCharAt(newX, newY, targetCell === BOX_ON_TARGET ? PLAYER_ON_TARGET : PLAYER);
            setCharAt(playerPosition.x, playerPosition.y, 
                      currentCell === PLAYER_ON_TARGET ? TARGET : FLOOR);
            
            playerPosition.x = newX;
            playerPosition.y = newY;
            moveCount++;
            updateDisplay();
            renderMap();
            
            // Vérifier si le niveau est terminé
            checkLevelComplete();
        }
    } else {
        // Déplacer le joueur normalement
        setCharAt(newX, newY, targetCell === TARGET ? PLAYER_ON_TARGET : PLAYER);
        setCharAt(playerPosition.x, playerPosition.y, 
                  currentCell === PLAYER_ON_TARGET ? TARGET : FLOOR);
        
        playerPosition.x = newX;
        playerPosition.y = newY;
        moveCount++;
        updateDisplay();
        renderMap();
    }
}

// Vérifier si le niveau est terminé
function checkLevelComplete() {
    // Le niveau est complet si toutes les cibles sont couvertes par des caisses
    for (let y = 0; y < gameMap.length; y++) {
        if (gameMap[y].includes(TARGET)) {
            return; // Il reste des cibles non couvertes
        }
    }
    
    // Afficher un message de victoire
    setTimeout(() => {
        if (currentLevel === levels.length - 1) {
            alert(`Félicitations ! Vous avez terminé tous les niveaux en ${moveCount} déplacements !`);
        } else {
            alert(`Niveau ${currentLevel + 1} terminé en ${moveCount} déplacements !`);
            // Passer au niveau suivant
            changeLevel(1);
        }
    }, 300);
}

// Initialiser le jeu au chargement
window.onload = initGame;
