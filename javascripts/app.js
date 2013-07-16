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
  var Board, CellModel, EnvironmentModel;

  EnvironmentModel = require("models/Environment");

  CellModel = require("models/Cell");

  module.exports = Board = (function() {
    Board.prototype.liveCells = void 0;

    function Board(width, height) {
      this.width = width;
      this.height = height;
      this.liveCells = new EnvironmentModel(this.width, this.height);
    }

    Board.prototype.spawn = function() {
      var nextGeneration;
      nextGeneration = new EnvironmentModel(this.width, this.height);
      this.putNextGenerationOfCellsIn(nextGeneration);
      return this.liveCells = nextGeneration;
    };

    Board.prototype.putNextGenerationOfCellsIn = function(nextGeneration) {
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
    };

    Board.prototype.processGridPosition = function(x, y, nextGeneration) {
      var cell, currentCell;
      cell = new CellModel(x, y);
      currentCell = this.liveCells.getCellAt(x, y);
      if (currentCell) {
        if (cell.canSurviveIn(this.liveCells)) {
          return nextGeneration.addCell(cell, true);
        } else {
          return jQuery(window).trigger("!cellRemoved", [currentCell]);
        }
      } else if (cell.numberOfNeighborsIn(this.liveCells) === 3) {
        return nextGeneration.addCell(cell);
      }
    };

    return Board;

  })();
  
});
window.require.register("models/Cell", function(exports, require, module) {
  var Cell;

  module.exports = Cell = (function() {
    function Cell(x, y) {
      this.x = x;
      this.y = y;
    }

    Cell.prototype.canSurviveIn = function(environment) {
      var neighborCount, _ref;
      neighborCount = this.numberOfNeighborsIn(environment);
      return (_ref = neighborCount === 2 || neighborCount === 3) != null ? _ref : {
        "true": false
      };
    };

    Cell.prototype.numberOfNeighborsIn = function(environment) {
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
    };

    return Cell;

  })();
  
});
window.require.register("models/Environment", function(exports, require, module) {
  var Environment;

  module.exports = Environment = (function() {
    Environment.prototype.length = 0;

    function Environment(width, height) {
      this.width = width;
      this.height = height;
      this.cellLookup = {};
    }

    Environment.prototype.addCell = function(cell, silent) {
      if (silent == null) {
        silent = false;
      }
      if (this.cellLookup[cell.x + "_" + cell.y] === void 0) {
        this.cellLookup[cell.x + "_" + cell.y] = cell;
        this.length += 1;
        if (!silent) {
          return jQuery(window).trigger("!cellAdded", [cell]);
        }
      }
    };

    Environment.prototype.getCellAt = function(x, y) {
      return this.cellLookup[this.clamp(x, this.width) + "_" + this.clamp(y, this.height)];
    };

    Environment.prototype.clamp = function(val, limit) {
      return (val + limit) % limit;
    };

    return Environment;

  })();
  
});
window.require.register("views/Board", function(exports, require, module) {
  var BoardView, CellView;

  CellView = require("views/Cell");

  module.exports = BoardView = (function() {
    BoardView.prototype.cells = {};

    function BoardView(model) {
      this.model = model;
      this.el = new createjs.Container;
      _.bindAll(this, "onCellAdded", "onCellRemoved");
      jQuery(window).bind("!cellAdded", this.onCellAdded);
      jQuery(window).bind("!cellRemoved", this.onCellRemoved);
    }

    BoardView.prototype.onCellAdded = function(jqEvent, model) {
      var cellView;
      cellView = new CellView(model);
      this.cells[model.x + "_" + model.y] = cellView;
      return this.el.addChild(cellView.el);
    };

    BoardView.prototype.onCellRemoved = function(jqEvent, model) {
      var cellView;
      cellView = this.cells[model.x + "_" + model.y];
      this.el.removeChild(cellView.el);
      return this.cells[model.x + "_" + model.y] = void 0;
    };

    BoardView.prototype.dispose = function() {
      jQuery(window).unbind("!cellAdded", this.onCellAdded);
      return jQuery(window).unbind("!cellRemoved", this.onCellRemoved);
    };

    return BoardView;

  })();
  
});
window.require.register("views/Cell", function(exports, require, module) {
  var CellView;

  module.exports = CellView = (function() {
    CellView.prototype.styles = {
      width: 10,
      height: 10,
      fill: "#ccc",
      stroke: "#f00"
    };

    function CellView(model) {
      this.model = model;
      this.el = new createjs.Shape;
      this.drawingInstructions();
      this.el.x = this.styles.width * this.model.x;
      this.el.y = this.styles.height * this.model.y;
    }

    CellView.prototype.drawingInstructions = function() {
      var height, width;
      width = this.styles.width;
      height = this.styles.height;
      this.el.graphics.beginFill(this.styles.fill);
      this.el.graphics.setStrokeStyle(0.5);
      this.el.graphics.beginStroke(this.styles.stroke);
      this.el.graphics.drawRect(0, 0, width, height);
      return this.el.graphics.endFill();
    };

    return CellView;

  })();
  
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
      createjs.Ticker.addEventListener("tick", this.onTick);
      this.boardModel = new BoardModel(48, 32);
      boardView = new BoardView(this.boardModel);
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
          var _j, _ref1, _ref2, _results1;
          _results1 = [];
          for (x = _j = 0, _ref1 = width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
            seed = (_ref2 = (Math.random() * 10) > 8) != null ? _ref2 : {
              "true": false
            };
            if (seed) {
              _results1.push(cells.addCell(new CellModel(x, y)));
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
