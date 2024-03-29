var Creep = require("creep");

module.exports = class RoleBuilder extends Creep {
  constructor(creep) {
    super(creep);
  }

  run() {
    if (!this.creep.memory.isFull) {
      const grab = this.grab();

      if (
        this.creep.store.getCapacity() === this.creep.store.getUsedCapacity()
      ) {
        this.creep.memory.isFull = true;
        return;
      }

      if (grab === "no storage") {
        this.break();
      }
    } else {
      if (this.build() === "nothing to build") {
        if (this.transfer(STRUCTURE_TOWER) === "full storage") {
          this.upgrade();
        }
      }

      if (this.creep.store.getUsedCapacity() === 0) {
        this.creep.memory.isFull = false;
      }
    }
  }
};
