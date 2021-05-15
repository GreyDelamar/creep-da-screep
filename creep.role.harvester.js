var Creep = require('creep');

module.exports = class RoleHarvester extends Creep {
  constructor(creep) {
    super(creep);
  }

  run () {
    if (!this.creep.memory.isFull && !this.creep.memory.break) {
      this.harvest()

      if (this.creep.store.getCapacity() === this.creep.store.getUsedCapacity()) {
        this.creep.memory.isFull = true
      }
    } else if (!this.creep.memory.break) {
      const store = this.store() === 'full storage'
      if (store) {
        this.creep.memory.break = true
      }

      if (this.creep.store.getUsedCapacity() === 0 || (this.creep.store.getFreeCapacity() > 0 && store)) {
        this.creep.memory.isFull = false
      }
    } else if (this.creep.memory.break) {
      this.break()

      if (this.store() !== 'full storage') {
        this.creep.memory.break = false
      }
    }
  }
}