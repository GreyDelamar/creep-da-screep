module.exports = class creep {
  constructor(creep) {
    // creep.memory.isFull = false;
    this.creep = creep;
  }

  harvest() {
    if (this.creep.memory.task !== "harvest") {
      this.creep.memory.task = "harvest";
      this.creep.say("⛏️ Harvest");
    }

    const sources = this.creep.room.find(FIND_SOURCES);

    if (this.creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(sources[1]);
    }
  }

  build(forceTarget) {
    if (this.creep.memory.task !== "build") {
      this.creep.memory.task = "build";
      this.creep.say("🚧 Build");
    }

    const target =
      forceTarget || this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    if (!target) return 'nothing to build';

    if (this.creep.build(target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  upgrade() {
    if (!this.creep.memory.task !== "upgrade") {
      this.creep.memory.task = "upgrade";
      this.creep.say("⚡ upgrade");
    }

    if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(this.creep.room.controller);
    }
  }

  repair(forceTarget) {
    if (this.creep.memory.task !== "repair") {
      this.creep.memory.task = "repair";
      this.creep.say("🛠️ repair");
    }

    let target = forceTarget || this.creep.room.find(FIND_STRUCTURES, {
      filter: (object) => object.hits < object.hitsMax,
    });

    if (Array.isArray(target) && target.length > 0) {
      target.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax); // sort by lowest health percentage;
      target = target[0]
    }

    if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  grab(forceTarget, resource = RESOURCE_ENERGY) {
    if (this.creep.memory.task !== "grab") {
      this.creep.memory.task = "grab";
      this.creep.say("🚚 grab");
    }

    const target = forceTarget || this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType == STRUCTURE_CONTAINER) &&
          structure.store.getCapacity(resource) > 0
        );
      },
    });

    if (!target) {
      this.harvest()
      return 'no storage'
    }

    if(this.creep.withdraw(target, resource) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target)
    }
  }

  drop() {}

  store() {
    if (this.creep.memory.task !== "store") {
      this.creep.memory.task = "store";
      this.creep.say("📦 Store");
    }

    const target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
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

    if (!target) return 'full storage'

    if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    }
  }

  transfer() {}

  break() {
    if (this.creep.memory.task !== "break") {
      this.creep.memory.task = "break";
      this.creep.say("🕒 break");
    }


    this.creep.moveTo(Game.flags["Break Flag"]);
  }

  die() {
    this.creep.suicide();
  }
}
