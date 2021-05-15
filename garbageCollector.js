var garbageCollector = {
  run: function () {
    if (Object.keys(Memory.creeps).length !== Object.keys(Game.creeps).length) {
      console.log("Ran GC")
      // Remove old creep memory... It is not removed by the game :(
      for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
          delete Memory.creeps[i];
        }
      }
    }
  },
};

module.exports = garbageCollector;
