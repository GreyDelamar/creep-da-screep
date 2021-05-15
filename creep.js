module.exports = class creep {
  constructor(creep) {
    // creep.memory.isFull = false;
    this.creep = creep;
  }

  harvest(goFar) {
    if (this.creep.memory.task !== "harvest") {
      this.creep.memory.task = "harvest";
      this.creep.say("⛏️ Harvest");
    }

    const sources = this.creep.room.find(FIND_SOURCES);

    if (this.creep.harvest(sources[goFar ? 0 : 1]) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(sources[goFar ? 0 : 1]);
    }
  }

  build(forceTarget) {
    const target =
      forceTarget || this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    if (!target) return "nothing to build";

    if (this.creep.memory.task !== "build") {
      this.creep.memory.task = "build";
      this.creep.say("🚧 Build");
    }

    if (this.creep.build(target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  upgrade() {
    if (this.creep.memory.task !== "upgrade") {
      this.creep.memory.task = "upgrade";
      this.creep.say("⚡ upgrade");
    }

    if (
      this.creep.upgradeController(this.creep.room.controller) ==
      ERR_NOT_IN_RANGE
    ) {
      this.creep.moveTo(this.creep.room.controller);
    }
  }

  repair(forceTarget) {
    let target =
      forceTarget ||
      this.creep.room.find(FIND_STRUCTURES, {
        filter: (object) =>
          object.hits < object.hitsMax &&
          object.structureType === STRUCTURE_RAMPART &&
          object.hits < 30000,
      });

    if (!target || (Array.isArray(target) && target.length === 0)) {
      return "nothing to repair";
    }

    if (this.creep.memory.task !== "repair") {
      this.creep.memory.task = "repair";
      this.creep.say("🛠️ repair");
    }

    if (Array.isArray(target) && target.length > 0) {
      target.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax); // sort by lowest health percentage;
      target = target[0];
    }

    if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  grab(forceTarget, resource = RESOURCE_ENERGY) {
    const target =
      forceTarget ||
      this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType == STRUCTURE_CONTAINER &&
            structure.store.getCapacity(resource) > 0
          );
        },
      });

    if (!target) {
      this.harvest();
      return "no storage";
    }

    if (this.creep.memory.task !== "grab") {
      this.creep.memory.task = "grab";
      this.creep.say("🚚 grab");
    }

    if (this.creep.withdraw(target, resource) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  drop() {}

  store() {
    const moreImportantTarget = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });

    const target = moreImportantTarget || this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType == STRUCTURE_TOWER ||
            structure.structureType == STRUCTURE_CONTAINER ) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });


    if (!target) return "full storage";

    if (this.creep.memory.task !== "store") {
      this.creep.memory.task = "store";
      this.creep.say("📦 Store");
    }

    if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  transfer(filter) {
    const target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_TOWER &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });

    if (!target) return "full storage";

    if (this.creep.memory.task !== "transfer") {
      this.creep.memory.task = "transfer";
      this.creep.say("📦 Xfer");
    }

    if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  break() {
    if (this.creep.memory.task !== "break") {
      this.creep.memory.task = "break";
      this.creep.say("🕒 break");
    }

    this.creep.moveTo(Game.flags["Break Flag"]);
  }

  pickupDroppedResources(resource) {
    const target = this.creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
      filter: (drop) => drop.resourceType === resource,
    });

    if (!target) return "nothing on the ground";

    if (this.creep.memory.task !== "pickupDroppedResources") {
      this.creep.memory.task = "pickupDroppedResources";
      this.creep.say("✔️ Pickup");
    }

    if (this.creep.pickup(target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  die() {
    this.creep.suicide();
  }
};
