const creepHarvester = require("creep.role.harvester");
const creepBuilder = require("creep.role.builder");
const creepRepairer = require("creep.role.repairer");
const creepUpgrader = require("creep.role.upgrader");
var spawner = require("spawner");
var garbageCollector = require("garbageCollector");
const logger = false;

module.exports.loop = function () {
  garbageCollector.run();
  spawner.run(logger);

  var tower = Game.getObjectById("TOWER_ID");
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    switch (creep.memory.role) {
      case "harvester":
        const CreepHarvester = new creepHarvester(creep);
        CreepHarvester.run();
        break;

      case "upgrader":
        const CreepUpgrader = new creepUpgrader(creep);
        CreepUpgrader.run();
        break;

      case "builder":
        const CreepBuilder = new creepBuilder(creep);
        CreepBuilder.run();
        break;

      case "repairer":
        const CreepRepairer = new creepRepairer(creep);
        CreepRepairer.run();
        break;

      case "testDummy":
        break;
    }
  }
};
