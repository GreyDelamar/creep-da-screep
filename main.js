
const creepHarvester = require('creep.role.harvester')
const creepBuilder = require('creep.role.builder')
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repairer');
var spawner = require('spawner');
var garbageCollector = require('garbageCollector');
const logger = false;

// console.log(Creep)

module.exports.loop = function () {
    garbageCollector.run()
    spawner.run(logger)

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    // console.log('hit here', JSON.stringify(Game.creeps))
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        switch (creep.memory.role) {
            case 'harvester':
                const CreepHarvester = new creepHarvester(creep)
                CreepHarvester.run();
                break;

            case 'upgrader':
                roleUpgrader.run(creep);
                break;

            case 'builder':
                const CreepBuilder = new creepBuilder(creep)
                CreepBuilder.run();
                break;

            case 'repairer':
                roleRepairer.run(creep);
                break;

            case 'testDummy':
                break;
        }

    }
}


