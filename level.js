const levels = [
    // Niveau 1 - tutoriel
    {
        map: [
            "######",
            "#....#",
            "#.#..#",
            "#..$+#",
            "#....#",
            "######"
        ],
        startPosition: { x: 3, y: 3 }
    },
    // Niveau 2
    {
        map: [
            "  ######",
            "###.   #",
            "#.$.#  #",
            "#.#$.  #",
            "#.+.####",
            "#####"
        ],
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
            "#+....#",
            "########"
        ],
        startPosition: { x: 1, y: 6 }
    },
    // Niveau 4
    {
        map: [
            "########",
            "#..+...#",
            "#.$$...#",
            "##.##..#",
            "#...#..#",
            "#.$.#..#",
            "#...#..#",
            "########"
        ],
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
            "#.+.#.#",
            "#######"
        ],
        startPosition: { x: 2, y: 6 }
    },
];

// Légende:
// # = mur
// . = sol
// $ = caisse
// * = caisse sur cible
// + = joueur sur cible
// @ = joueur
// Espace = vide (non accessible)
