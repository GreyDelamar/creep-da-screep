var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🚚 grab");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🔨 build");
    }

    if (creep.memory.building) {
      var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    } else {
      var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              (structure.structureType == STRUCTURE_CONTAINER) &&
              structure.store.getCapacity(RESOURCE_ENERGY) > 0
            );
          },
      });

      if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
      } else {
          var sources = creep.room.find(FIND_SOURCES);

          if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: "#ffaa00" } });
    
            if (creep.memory.task !== "harvest") {
              creep.memory.task = "harvest";
              creep.say("⛏️ Harvest");
            }
          }

      }
    }
    // need to build an else to make the creeps stand to the side if they aren't doing anything
  },
};

module.exports = roleBuilder;
