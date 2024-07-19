let level1;

/**
 * Initializes the game level by creating a new instance of the Level class.
 * This includes setting up enemies, the end boss, clouds, background objects,
 * coins, and bottles for the level.
 */
function initLevel() {
    
level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new ChickenSmall(),
        new ChickenSmall(),
        new Chicken(),       
    ],
    [
        new Endboss(),
    ],
    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ],
    [
        new BackgroundObject('img/5_background/layers/air.png', -1440),
        new BackgroundObject('img/5_background/layers/air.png', -720),
        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/air.png', 720),
        new BackgroundObject('img/5_background/layers/air.png', 1440),
        new BackgroundObject('img/5_background/layers/air.png', 2160),

        new BackgroundObject('img/5_background/layers/3_third_layer/full.png', -1440),
        new BackgroundObject('img/5_background/layers/2_second_layer/full.png', -1440),
        new BackgroundObject('img/5_background/layers/1_first_layer/full.png', -1440),
        new BackgroundObject('img/5_background/layers/3_third_layer/full.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/full.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/full.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/full.png', 1440),
        new BackgroundObject('img/5_background/layers/2_second_layer/full.png', 1440),
        new BackgroundObject('img/5_background/layers/1_first_layer/full.png', 1440),
        new BackgroundObject('img/5_background/layers/3_third_layer/full.png', 2880),
        new BackgroundObject('img/5_background/layers/2_second_layer/full.png', 2880),
        new BackgroundObject('img/5_background/layers/1_first_layer/full.png', 2880),
    ],
    [
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
    ],
    [
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
    ]
);
}