// Constantes et variables globales
const WALL = '#';
const FLOOR = '.';
const BOX = '$';
const PLAYER = '@';
const EMPTY = ' ';
const TARGET_CLASS = 'target';    // Classe CSS pour les cibles
const BOX_CLASS = 'box';          // Classe CSS pour les caisses
const BOX_ON_TARGET_CLASS = 'box-on-target'; // Classe CSS pour les caisses sur cible
const PLAYER_CLASS = 'player';    // Classe CSS pour le joueur

let currentLevel = 0;
let playerPosition = { x: 0, y: 0 };
let gameMap = [];
let originalMap = [];
let moveCount = 0;
let targetPositions = [];  // Positions des cibles du niveau actuel

// Éléments du DOM
let gameBoard;
let levelDisplay;
let movesDisplay;
let resetButton;
let prevLevelButton;
let nextLevelButton;

// Initialisation du jeu
function initGame() {
    // Récupérer les éléments du DOM
    gameBoard = document.getElementById('game-board');
    levelDisplay = document.getElementById('level-display');
    movesDisplay = document.getElementById('moves-display');
    resetButton = document.getElementById('reset-btn');
    prevLevelButton = document.getElementById('prev-level');
    nextLevelButton = document.getElementById('next-level');
    
    if (!gameBoard) {
        console.error("Élément game-board introuvable!");
        return;
    }
    
    loadLevel(currentLevel);
    
    // Écouteurs d'événements
    document.addEventListener('keydown', handleKeyPress);
    resetButton.addEventListener('click', resetLevel);
    prevLevelButton.addEventListener('click', () => changeLevel(-1));
    nextLevelButton.addEventListener('click', () => changeLevel(1));
    
    console.log("Jeu initialisé avec succès!");
}

// Charger un niveau
function loadLevel(levelIndex) {
    if (levelIndex < 0 || levelIndex >= levels.length) {
        return;
    }
    
    currentLevel = levelIndex;
    moveCount = 0;
    
    // Récupérer les positions des cibles
    targetPositions = [...levels[currentLevel].targetPositions];
    
    // Copier la carte du niveau
    originalMap = levels[currentLevel].map.map(row => row);
    
    // Valider le niveau
    validateLevel();
    
    resetLevel();
    updateDisplay();
}

// Valider le niveau (vérifier l'équilibre caisses/cibles)
function validateLevel() {
    let boxCount = 0;
    
    for (let y = 0; y < originalMap.length; y++) {
        for (let x = 0; x < originalMap[y].length; x++) {
            if (originalMap[y][x] === BOX) {
                boxCount++;
            }
        }
    }
    
    if (boxCount !== targetPositions.length) {
        console.warn(`AVERTISSEMENT: Le niveau ${currentLevel + 1} a ${boxCount} caisses mais ${targetPositions.length} cibles!`);
    } else {
        console.log(`Niveau ${currentLevel + 1} validé: ${boxCount} caisses et ${targetPositions.length} cibles`);
    }
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

// Vérifier si une position est une cible
function isTarget(x, y) {
    return targetPositions.some(pos => pos.x === x && pos.y === y);
}

// Rendre la carte du jeu
function renderMap() {
    gameBoard.innerHTML = '';
    
    // Calculer la largeur maximale
    let maxWidth = 0;
    for (const row of gameMap) {
        maxWidth = Math.max(maxWidth, row.length);
    }
    
    gameBoard.style.gridTemplateColumns = `repeat(${maxWidth}, 40px)`;
    
    for (let y = 0; y < gameMap.length; y++) {
        const row = gameMap[y];
        for (let x = 0; x < row.length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            const char = row[x];
            const isTargetPos = isTarget(x, y);
            
            switch (char) {
                case WALL:
                    cell.classList.add('wall');
                    break;
                case FLOOR:
                    cell.classList.add('floor');
                    if (isTargetPos) {
                        cell.classList.add(TARGET_CLASS);
                    }
                    break;
                case BOX:
                    cell.classList.add('floor');
                    cell.classList.add(BOX_CLASS);
                    if (isTargetPos) {
                        cell.classList.add(TARGET_CLASS);
                        cell.classList.add(BOX_ON_TARGET_CLASS);
                    }
                    break;
                case PLAYER:
                    cell.classList.add('floor');
                    cell.classList.add(PLAYER_CLASS);
                    if (isTargetPos) {
                        cell.classList.add(TARGET_CLASS);
                    }
                    break;
                case EMPTY:
                    // Espace vide, ne rien faire
                    break;
                default:
                    cell.classList.add('floor');
                    break;
            }
            
            gameBoard.appendChild(cell);
        }
    }
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
        // On utilise le split/join pour modifier la chaîne de caractères
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
    
    const targetCell = getCharAt(newX, newY);
    
    if (!targetCell) return; // Hors limites
    if (targetCell === WALL) return; // Ne peut pas traverser les murs
    if (targetCell === EMPTY) return; // Ne peut pas aller dans l'espace vide
    
    if (targetCell === BOX) {
        // Essayer de pousser la caisse
        const nextX = newX + dx;
        const nextY = newY + dy;
        const nextCell = getCharAt(nextX, nextY);
        
        // Vérifier si la caisse peut être poussée
        if (nextCell === FLOOR) {
            // Déplacer la caisse
            setCharAt(nextX, nextY, BOX);
            
            // Déplacer le joueur
            setCharAt(newX, newY, PLAYER);
            setCharAt(playerPosition.x, playerPosition.y, FLOOR);
            
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
        setCharAt(newX, newY, PLAYER);
        setCharAt(playerPosition.x, playerPosition.y, FLOOR);
        
        playerPosition.x = newX;
        playerPosition.y = newY;
        moveCount++;
        updateDisplay();
        renderMap();
    }
}

// Vérifier si le niveau est terminé
function checkLevelComplete() {
    // Compter combien de cibles sont couvertes par des caisses
    let targetsCompleted = 0;
    
    for (const target of targetPositions) {
        if (getCharAt(target.x, target.y) === BOX) {
            targetsCompleted++;
        }
    }
    
    // Si toutes les cibles sont couvertes, le niveau est terminé
    if (targetsCompleted === targetPositions.length) {
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
}

// Initialiser le jeu au chargement
window.onload = initGame;
