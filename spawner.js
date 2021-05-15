// module.exports = {
// Game.spawns['MainSpawn'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1', { memory: { role: "" }} );
// };

var spawner = {
  /** @param {Creep} creep **/
  run: function (logCounts) {
    const counts = spawner.getCreepCounts();

    if (logCounts) console.log(JSON.stringify(counts, null, 2));
    // console.log(
    //   spawner.bodyCost([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE])
    // );

    // console.log(typeof counts.harvester.count, counts.upgrader.count < 1);

    if (counts.harvester.count < 2) {
      spawner.createCreep("harvester", counts.harvester.highNum, [
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        MOVE,
        MOVE,
        MOVE,
      ]);
    } else if (counts.testDummy.count < 0) {
      spawner.createCreep("testDummy", counts.testDummy.highNum, [
        WORK,
        CARRY,
        MOVE,
      ]);
    } else if (counts.upgrader.count < 3) {
      spawner.createCreep("upgrader", counts.upgrader.highNum, [
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        MOVE,
        MOVE,
        MOVE,
      ]);
    } else if (counts.builder.count < 2) {
      spawner.createCreep("builder", counts.builder.highNum, [
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY,
        MOVE,
        MOVE,
        MOVE,
      ]);
    } else if (counts.repairer.count < 1) {
      spawner.createCreep("repairer", counts.builder.highNum, [
        WORK,
        WORK,
        CARRY,
        CARRY,
        CARRY,
        MOVE,
        MOVE,
        MOVE,
      ]);
    }
  },
  createCreep(role, highNum, bodyParts) {
    // console.log(role, highNum, bodyParts);
    Game.spawns["MainSpawn"].spawnCreep(
      bodyParts,
      role + (parseFloat(highNum) + 1),
      {
        memory: { role, isFull: false, break: false },
      }
    );
  },
  getCreepCounts() {
    const counts = {
      harvester: { count: 0, highNum: 0 },
      builder: { count: 0, highNum: 0 },
      upgrader: { count: 0, highNum: 0 },
      repairer: { count: 0, highNum: 0 },
      testDummy: { count: 0, highNum: 0 },
    };
    const creepArr = Object.keys(Game.creeps);

    for (let i = 0; i < creepArr.length; i++) {
      const creep = Game.creeps[creepArr[i]];

      let countTarget = counts[creep.memory.role];
      let info = creep.name.split(/(\d)/);

      if (countTarget) {
        if (creep.ticksToLive > 30) countTarget.count++;

        if (parseFloat(info[1]) > countTarget.highNum) {
          countTarget.highNum = parseFloat(info[1]);
        }
      }
    }

    return counts;
  },
  bodyCost(body) {
    let sum = 0;

    for (let i in body) {
      sum += BODYPART_COST[body[i]];
    }

    return sum;
  },
  newRun() {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
  }
};

module.exports = spawner;
