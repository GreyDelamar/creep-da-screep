var Creep = require('creep');

module.exports = class RoleRepairer extends Creep {
  constructor(creep) {
    super(creep);
  }

  run () {
    if (!this.creep.memory.isFull) {
      if (this.grab() === 'no storage') {
        this.harvest()
      }

      if (this.creep.store.getCapacity() === this.creep.store.getUsedCapacity()) {
        this.creep.memory.isFull = true
      }
    } else {
      if (this.repair() === 'nothing to repair') {
        this.upgrade()
      }

      if (this.creep.store.getUsedCapacity() === 0) {
        this.creep.memory.isFull = false
      }
    }
  }
}