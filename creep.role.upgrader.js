var Creep = require("creep");

module.exports = class RoleUpgrader extends Creep {
  constructor(creep) {
    super(creep);
  }

  run() {
    if (!this.creep.memory.isFull) {
      this.harvest(true);

      if (
        this.creep.store.getCapacity() === this.creep.store.getUsedCapacity()
      ) {
        this.creep.memory.isFull = true;
      }
    } else {
      if (this.transfer(STRUCTURE_TOWER) === "full storage") {
        this.upgrade();
      }

      if (this.creep.store.getUsedCapacity() === 0) {
        this.creep.memory.isFull = false;
      }
    }
  }
};
