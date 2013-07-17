(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  var Application, StageView;

  StageView = require("views/Stage");

  module.exports = Application = (function() {
    function Application() {}

    Application.prototype.initialize = function() {
      var canvasEl;
      canvasEl = document.getElementById("main-canvas");
      return new StageView(canvasEl);
    };

    return Application;

  })();
  
});
window.require.register("initialize", function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    return (new Application).initialize();
  });
  
});
window.require.register("models/Board", function(exports, require, module) {
  var CellModel, EnvironmentModel;

  EnvironmentModel = require("models/Environment");

  CellModel = require("models/Cell");

  module.exports = gamecore.DualPooled.extend('BoardModel', {
    create: function(width, height) {
      var board;
      board = this._super();
      board.liveCells = EnvironmentModel.create(width, height);
      board.width = width;
      board.height = height;
      return board;
    }
  }, {
    dispose: function() {
      this.liveCells.dispose();
      return this.release();
    },
    spawn: function() {
      var nextGeneration;
      nextGeneration = EnvironmentModel.create(this.width, this.height);
      this.putNextGenerationOfCellsIn(nextGeneration);
      this.liveCells.dispose();
      return this.liveCells = nextGeneration;
    },
    putNextGenerationOfCellsIn: function(nextGeneration) {
      var x, y, _i, _ref, _results;
      _results = [];
      for (y = _i = 0, _ref = this.height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (x = _j = 0, _ref1 = this.width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
            _results1.push(this.processGridPosition(x, y, nextGeneration));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    processGridPosition: function(x, y, nextGeneration) {
      var cell, currentCell;
      cell = CellModel.create(x, y);
      currentCell = this.liveCells.getCellAt(x, y);
      if (currentCell) {
        if (cell.canSurviveIn(this.liveCells)) {
          return nextGeneration.addCell(cell, true);
        } else {
          jQuery(window).trigger("!cellRemoved", [currentCell]);
          return cell.dispose();
        }
      } else if (cell.numberOfNeighborsIn(this.liveCells) === 3) {
        return nextGeneration.addCell(cell);
      } else {
        return cell.dispose();
      }
    }
  });
  
});
window.require.register("models/Cell", function(exports, require, module) {
  module.exports = gamecore.DualPooled.extend('CellModel', {
    create: function(x, y) {
      var cell;
      cell = this._super();
      cell.x = x;
      cell.y = y;
      return cell;
    }
  }, {
    dispose: function() {
      return this.release();
    },
    canSurviveIn: function(environment) {
      var neighborCount;
      neighborCount = this.numberOfNeighborsIn(environment);
      return (2 <= neighborCount && neighborCount <= 3);
    },
    numberOfNeighborsIn: function(environment) {
      var result;
      result = 0;
      if (environment.getCellAt(this.x, this.y + 1)) {
        result++;
      }
      if (environment.getCellAt(this.x + 1, this.y + 1)) {
        result++;
      }
      if (environment.getCellAt(this.x + 1, this.y)) {
        result++;
      }
      if (environment.getCellAt(this.x + 1, this.y - 1)) {
        result++;
      }
      if (environment.getCellAt(this.x, this.y - 1)) {
        result++;
      }
      if (environment.getCellAt(this.x - 1, this.y - 1)) {
        result++;
      }
      if (environment.getCellAt(this.x - 1, this.y)) {
        result++;
      }
      if (environment.getCellAt(this.x - 1, this.y + 1)) {
        result++;
      }
      return result;
    }
  });
  
});
window.require.register("models/Environment", function(exports, require, module) {
  module.exports = gamecore.DualPooled.extend('EnvironmentModel', {
    create: function(width, height) {
      var environment;
      environment = this._super();
      environment.cellLookup = {};
      environment.width = width;
      environment.height = height;
      environment.length = 0;
      return environment;
    }
  }, {
    dispose: function() {
      var cell, id, _ref;
      _ref = this.cellLookup;
      for (id in _ref) {
        cell = _ref[id];
        if (cell.dispose) {
          cell.dispose();
        }
      }
      return this.release();
    },
    addCell: function(cell, silent) {
      if (silent == null) {
        silent = false;
      }
      if (this.cellLookup["" + cell.x + "_" + cell.y] === void 0) {
        this.cellLookup["" + cell.x + "_" + cell.y] = cell;
        this.length += 1;
        if (!silent) {
          return jQuery(window).trigger("!cellAdded", [cell]);
        }
      }
    },
    getCellAt: function(x, y) {
      return this.cellLookup["" + (this.clamp(x, this.width)) + "_" + (this.clamp(y, this.height))];
    },
    clamp: function(val, limit) {
      return (val + limit) % limit;
    }
  });
  
});
window.require.register("views/Board", function(exports, require, module) {
  var CellView;

  CellView = require("views/Cell");

  module.exports = gamecore.DualPooled.extend('BoardView', {
    create: function(model) {
      var board;
      board = this._super();
      board.model = model;
      board.cells = {};
      board.el = new createjs.Container;
      _.bindAll(board, "onCellAdded", "onCellRemoved");
      jQuery(window).bind("!cellAdded", board.onCellAdded);
      jQuery(window).bind("!cellRemoved", board.onCellRemoved);
      return board;
    }
  }, {
    onCellAdded: function(jqEvent, model) {
      var cellView;
      cellView = CellView.create(model);
      this.cells["" + model.x + "_" + model.y] = cellView;
      return this.el.addChild(cellView.el);
    },
    onCellRemoved: function(jqEvent, model) {
      var cellView;
      cellView = this.cells["" + model.x + "_" + model.y];
      if (cellView && cellView.el) {
        this.el.removeChild(cellView.el);
      }
      cellView.dispose();
      return this.cells["" + model.x + "_" + model.y] = void 0;
    },
    dispose: function() {
      var cell, key, _ref;
      jQuery(window).unbind("!cellAdded", this.onCellAdded);
      jQuery(window).unbind("!cellRemoved", this.onCellRemoved);
      _ref = this.cells;
      for (key in _ref) {
        cell = _ref[key];
        if (cell) {
          cell.dispose();
        }
      }
      return this.release();
    }
  });
  
});
window.require.register("views/Cell", function(exports, require, module) {
  module.exports = gamecore.DualPooled.extend('CellView', {
    create: function(model) {
      var cell;
      cell = this._super();
      cell.el = new createjs.Shape;
      cell.model = model;
      cell.styles = {
        width: 10,
        height: 10,
        fill: "#ccc",
        stroke: "#666"
      };
      cell.drawingInstructions();
      cell.el.x = cell.styles.width * model.x;
      cell.el.y = cell.styles.height * model.y;
      return cell;
    }
  }, {
    drawingInstructions: function() {
      var graphics, height, width;
      width = this.styles.width;
      height = this.styles.height;
      graphics = this.el.graphics;
      graphics.beginFill(this.styles.fill);
      graphics.setStrokeStyle(0.5);
      graphics.beginStroke(this.styles.stroke);
      graphics.drawRect(0, 0, width, height);
      return graphics.endFill();
    },
    dispose: function() {
      return this.release();
    }
  });
  
});
window.require.register("views/Stage", function(exports, require, module) {
  var BoardModel, BoardView, CellModel, StageView;

  BoardView = require("views/Board");

  BoardModel = require("models/Board");

  CellModel = require("models/Cell");

  module.exports = StageView = (function() {
    function StageView(canvasEl) {
      var boardView;
      this.canvasEl = canvasEl;
      this.el = new createjs.Stage(this.canvasEl);
      this.el.update();
      _.bindAll(this, "onTick");
      createjs.Ticker.setFPS(4);
      createjs.Ticker.useRAF = true;
      createjs.Ticker.addEventListener("tick", this.onTick);
      this.boardModel = BoardModel.create(48, 32);
      boardView = BoardView.create(this.boardModel);
      this.populateBoard();
      this.el.addChild(boardView.el);
    }

    StageView.prototype.populateBoard = function() {
      var cells, height, seed, width, x, y, _i, _ref, _results;
      cells = this.boardModel.liveCells;
      width = this.boardModel.width;
      height = this.boardModel.height;
      _results = [];
      for (y = _i = 0, _ref = height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (x = _j = 0, _ref1 = width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
            seed = (Math.random() * 10) > 8;
            if (seed) {
              _results1.push(cells.addCell(CellModel.create(x, y)));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    StageView.prototype.onTick = function() {
      this.boardModel.spawn();
      return this.el.update();
    };

    StageView.prototype.dispose = function() {
      return createjs.Ticker.removeEventListener("tick", this.onTick);
    };

    return StageView;

  })();
  
});
