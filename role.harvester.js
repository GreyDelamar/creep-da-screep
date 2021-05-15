var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (!creep.memory.isFull) {
      var sources = creep.room.find(FIND_SOURCES);

      if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], { visualizePathStyle: { stroke: "#ffaa00" } });

        if (creep.memory.task !== "harvest") {
          creep.memory.task = "harvest";
          creep.say("⛏️ Harvest");
        }
      }

      if (creep.memory.task === "harvest"){
        if (creep.store.getCapacity() === creep.store.getUsedCapacity()) {
          creep.memory.isFull = true
        }
      }
    } else {
      if (creep.store.getUsedCapacity() === 0) {
        creep.memory.isFull = false
      }

      var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER ||
              structure.structureType == STRUCTURE_CONTAINER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });

      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: { stroke: "#ffffff" },
          });

          if (creep.memory.task !== "store") {
            creep.memory.task = "store";
            creep.say("📦 Store");
          }
        }
      } else {
         var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
         if (targets.length) {
           if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
             creep.moveTo(targets[0], {
               visualizePathStyle: { stroke: "#ffffff" },
             });

             if (creep.memory.task !== "build") {
               creep.memory.task = "build";
               creep.say("🔨 build");
             }
           }
         }
       }
    }
  },
};

module.exports = roleHarvester;
