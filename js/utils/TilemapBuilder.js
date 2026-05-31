// Converts 2D integer tilemap arrays into Phaser StaticGroups
var TilemapBuilder = {
    // Returns a StaticGroup of tile sprites
    buildMap: function (scene, mapArray, tileSize) {
        var group = scene.physics.add.staticGroup();
        var tileSize = tileSize || CONSTANTS.TILE_SIZE;

        for (var row = 0; row < mapArray.length; row++) {
            for (var col = 0; col < mapArray[row].length; col++) {
                var tileId = mapArray[row][col];
                if (tileId === 0) continue;

                var textureKey = TilemapBuilder.getTileTexture(tileId);
                if (!textureKey) continue;

                var x = col * tileSize + tileSize / 2;
                var y = row * tileSize + tileSize / 2;

                var tile = group.create(x, y, textureKey);
                tile.tileId = tileId;
                tile.refreshBody();
            }
        }

        return group;
    },

    getTileTexture: function (tileId) {
        var T = CONSTANTS.TILES;
        switch (tileId) {
            case T.OFFICE_FLOOR:    return 'tile_office_floor';
            case T.OFFICE_WALL:     return 'tile_office_wall';
            case T.OFFICE_PLATFORM: return 'tile_platform_wood';
            case T.SALON_FLOOR:     return 'tile_salon_floor';
            case T.SALON_WALL:      return 'tile_salon_wall';
            case T.SALON_PLATFORM:  return 'tile_platform_glass';
            case T.KITCHEN_FLOOR:   return 'tile_kitchen_floor';
            case T.KITCHEN_WALL:    return 'tile_kitchen_wall';
            case T.KITCHEN_PLATFORM:return 'tile_platform_metal';
            case T.CS_FLOOR:        return 'tile_cs_floor';
            case T.CS_WALL:         return 'tile_cs_wall';
            case T.CS_PLATFORM:     return 'tile_platform_wood';
            case T.HOTEL_FLOOR:     return 'tile_hotel_floor';
            case T.HOTEL_WALL:      return 'tile_hotel_wall';
            case T.HOTEL_PLATFORM:  return 'tile_platform_glass';
            case T.DOOR_LOCKED:     return 'door_locked';
            case T.DOOR_OPEN:       return 'door_open';
            case T.CHECKPOINT:      return 'checkpoint_flag';
            case T.LEVEL_END:       return 'level_end_flag';
            case T.PLATFORM_WOOD:   return 'tile_platform_wood';
            case T.PLATFORM_GLASS:  return 'tile_platform_glass';
            case T.PLATFORM_METAL:  return 'tile_platform_metal';
            default:                return null;
        }
    },

    // Spawn enemies from spawn data array
    spawnEnemies: function (scene, spawnData, enemyGroup) {
        spawnData.forEach(function (data) {
            var enemy;
            switch (data.type) {
                case CONSTANTS.ENEMIES.GERM:
                    enemy = new GermEnemy(scene, data.x, data.y);
                    break;
                case CONSTANTS.ENEMIES.SMELL_CLOUD:
                    enemy = new SmellCloudEnemy(scene, data.x, data.y);
                    break;
                case CONSTANTS.ENEMIES.HAIR_MONSTER:
                    enemy = new HairMonsterEnemy(scene, data.x, data.y);
                    break;
                case CONSTANTS.ENEMIES.DIRTY_ROBOT:
                    enemy = new DirtyRobotEnemy(scene, data.x, data.y);
                    break;
                default:
                    return;
            }
            if (enemy) {
                scene.add.existing(enemy);
                scene.physics.add.existing(enemy);
                enemyGroup.add(enemy);
            }
        });
    },

    // Spawn collectible items
    spawnItems: function (scene, itemData, itemGroup) {
        itemData.forEach(function (data) {
            var item = new CollectibleItem(scene, data.x, data.y, data.type);
            scene.add.existing(item);
            itemGroup.add(item);
        });
    },

    // Spawn static hazards
    spawnHazards: function (scene, hazardData, hazardGroup) {
        hazardData.forEach(function (data) {
            var hazard = new HazardItem(scene, data.x, data.y, data.type);
            scene.add.existing(hazard);
            hazardGroup.add(hazard);
        });
    }
};
