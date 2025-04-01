const levels = [
    // Niveau 1 - tutoriel
    {
        map: [
            "######",
            "#....#",
            "#.#..#",
            "#..$@#",
            "#....#",
            "######"
        ],
        targetPositions: [{x: 1, y: 1}, {x: 2, y: 1}],  // Position des cibles
        startPosition: { x: 3, y: 3 }
    },
    // Niveau 2
    {
        map: [
            "  ######",
            "###.   #",
            "#.$.#  #",
            "#.#$.  #",
            "#.@.####",
            "#####"
        ],
        targetPositions: [{x: 1, y: 2}, {x: 3, y: 3}],
        startPosition: { x: 2, y: 4 }
    },
    // Niveau 3
    {
        map: [
            "########",
            "#......#",
            "#..$...#",
            "#.$#...#",
            "#..$.###",
            "#.#...#",
            "#@....#",
            "########"
        ],
        targetPositions: [{x: 1, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}],
        startPosition: { x: 1, y: 6 }
    },
    // Niveau 4
    {
        map: [
            "########",
            "#..@...#",
            "#.$$...#",
            "##.##..#",
            "#...#..#",
            "#.$.#..#",
            "#...#..#",
            "########"
        ],
        targetPositions: [{x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}],
        startPosition: { x: 3, y: 1 }
    },
    // Niveau 5
    {
        map: [
            "#######",
            "#.....#",
            "#.###.#",
            "#.$...#",
            "#.$.#.#",
            "#.$.#.#",
            "#.@.#.#",
            "#######"
        ],
        targetPositions: [{x: 5, y: 2}, {x: 5, y: 4}, {x: 5, y: 6}],
        startPosition: { x: 2, y: 6 }
    },
];

// Légende modifiée:
// # = mur
// . = sol
// $ = caisse
// @ = joueur
// Espace = vide (non accessible)
// 
// Note: Les positions des cibles sont maintenant définies séparément 
// dans targetPositions pour chaque niveau
