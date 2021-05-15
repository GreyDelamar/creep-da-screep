var roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {

    // console.log(creep.memory.task)
    if (
      creep.memory.task !== "grab" &&
      creep.memory.task !== "build" &&
      creep.memory.isFull
    ) {
      if (creep.memory.task !== "repair" && creep.memory.task !== "break") {
        creep.memory.task = "repair";
        creep.memory.target = undefined;
        creep.say("🚧 repair");
      } else if (creep.store.getUsedCapacity() === 0) {
        creep.memory.isFull = false;

        return;
      }

      var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (object) => object.hits < object.hitsMax,
        });

      if (targets.length === 0 && creep.memory.task !== "build") {
        creep.memory.task = "build";
        return;
      }
      // if (targets.length === 0 && creep.memory.task !== "break") {
      //   creep.memory.task = "break";
      //   creep.say("🕒 break");
      //   creep.memory.target = undefined;

      //   return;
      // } else if (targets.length > 0 && creep.memory.task === "break") {
      //   creep.memory.task = undefined;
      //   return;
      // }

      if (Array.isArray(targets) && targets.length > 0) {
        targets.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax); // sort by lowest health;

        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.memory.target = targets[0].pos;

          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else if (!Array.isArray(targets)) {
        creep.moveTo(targets, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      } else if (creep.memory.task === "break") {
        creep.moveTo(Game.flags["Break Flag"]);
      }
    } else if (creep.memory.task === "build") {
      // if (creep.memory.task !== "build") {
      creep.say("🔨 build");
      // }

      creep.memory.target = undefined;

      var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    } else {
      if (creep.memory.task !== "grab") {
        creep.memory.task = "grab";
        creep.say("🚚 grab");
        creep.memory.target = undefined;
      } else if (creep.store.getFreeCapacity() == 0) {
        console.log("cleared");
        creep.memory.task = undefined;
        creep.memory.target = undefined;
        creep.memory.isFull = true;

        return;
      }

      var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_CONTAINER &&
              structure.store.getCapacity(RESOURCE_ENERGY) > 0
            );
          },
        });

      if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.memory.target = target.pos;

        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  },
};

module.exports = roleRepairer;
