var Game = require('../game');

exports.TIMESTEP = 1/Game.TIMESTEP/1000;

var timeouts = []
  , added = []
  , index = 0;

var TIMEOUT = 0
  , INTERVAL = 1;

exports.setTimeout = function(fn,ms){
  // 500ms = 30frames
  var frames = Math.round(ms*exports.TIMESTEP);
  var id = index++;
  added.push(id,fn,frames,TIMEOUT);
  return id;
}

exports.clearTimeout = function(id){
  return outOfRange(id)
      || clearAdded(id,TIMEOUT)
      || clearTimeouts(id,TIMEOUT)
}

exports.setInterval = function(fn,ms){
  // 500ms = 30frames
  var frames = Math.round(ms*exports.TIMESTEP);
  var id = index++;
  added.push(id,fn,frames,INTERVAL);
  return id;
}

exports.clearInterval = function(id){
  return outOfRange(id)
      || clearAdded(id,INTERVAL)
      || clearTimeouts(id,INTERVAL)
}

exports.update = function(world){
  checkForAdded(world.frame)
  checkForActive(world.frame)
}

function checkForAdded(frame){
  var needSort = false;
  while(added.length){
    needSort = true;
    var id = added.shift()
      , fn = added.shift()
      , fr = added.shift()
      , to = added.shift()
    timeouts.push(world.frame+fr-1,id,fn,to);
  }

  if( needSort ){
    // TODO how to sort [frame,callback...] on frame?
  }
}

function checkForActive(frame){
  while(timeouts[0] === frame){
    var fr = timeouts.shift()
      , id = timeouts.shift()
      , fn = timeouts.shift()
      , to = timeouts.shift() // timeout=1 / interval=0
    fn();

    // re-add intervals
    if( to === INTERVAL ) added.push(id,fn,fr-frame,0);
  }
}

function outOfRange(id){
  return id >= index;
}

function clearAdded(id,type){
  for(var i=0; i<added.length; i += 4){
    if( added[i] === id && added[i+3] === type ){
      added.splice(i,4);
      return true;
    }
  }
}

function clearTimeouts(id,type){
  for(var i=0; i<timeouts.length; i += 4){
    if( timeouts[i] === id && timeouts[i+3] === type ){
      timeouts.splice(i,4);
      return true;
    }
  }
}