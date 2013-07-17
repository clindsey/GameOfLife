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

window.require.register("test/initialize", function(exports, require, module) {
  var test, tests, _i, _len;

  tests = ["./models/environment", "./models/cell", "./models/board", "./views/board"];

  for (_i = 0, _len = tests.length; _i < _len; _i++) {
    test = tests[_i];
    require(test);
  }
  
});
window.require.register("test/models/board", function(exports, require, module) {
  var BoardModel, CellModel, EnvironmentModel;

  BoardModel = require("models/Board");

  CellModel = require("models/Cell");

  EnvironmentModel = require("models/Environment");

  describe("Model Board", function() {
    beforeEach(function() {
      this.board = BoardModel.create(20, 20);
      return this.liveCells = this.board.liveCells;
    });
    afterEach(function() {
      this.board.dispose();
      expect(BoardModel.getPool().usedList.length()).to.equal(0);
      expect(CellModel.getPool().usedList.length()).to.equal(0);
      return expect(EnvironmentModel.getPool().usedList.length()).to.equal(0);
    });
    it("should contain no live cells when created", function() {
      return expect(this.liveCells.length).to.equal(0);
    });
    it("should spawn no live cells if seeded empty", function() {
      this.board.spawn();
      return expect(this.liveCells.length).to.equal(0);
    });
    it("should fire a cellAdded event when a cell is added", function() {
      var newCell, wasCalled;
      wasCalled = false;
      newCell = CellModel.create(2, 2);
      jQuery(window).bind("!cellAdded", function(jqEvent, cell) {
        if (cell === newCell) {
          return wasCalled = true;
        }
      });
      this.liveCells.addCell(newCell);
      return expect(wasCalled).to.equal(true);
    });
    it("should fire a cellRemoved event when a cell is removed", function() {
      var newCell, wasCalled;
      wasCalled = false;
      newCell = CellModel.create(2, 2);
      jQuery(window).bind("!cellRemoved", function(jqEvent, cell) {
        if (cell === newCell) {
          return wasCalled = true;
        }
      });
      this.liveCells.addCell(newCell);
      this.board.spawn();
      return expect(wasCalled).to.equal(true);
    });
    it("should spawn no live cells if seeded with one cell", function() {
      var newCell;
      newCell = CellModel.create(2, 2);
      this.liveCells.addCell(newCell);
      this.board.spawn();
      return expect(this.board.liveCells.length).to.equal(0);
    });
    it("should spawn no live cells if seeded with two neighboring cells", function() {
      var newCellA, newCellB;
      newCellA = CellModel.create(2, 2);
      newCellB = CellModel.create(2, 3);
      this.liveCells.addCell(newCellA);
      this.liveCells.addCell(newCellB);
      this.board.spawn();
      return expect(this.board.liveCells.length).to.equal(0);
    });
    it("should exhibit the block pattern", function() {
      var newCellA, newCellB, newCellC, newCellD;
      newCellA = CellModel.create(2, 2);
      newCellB = CellModel.create(2, 3);
      newCellC = CellModel.create(3, 2);
      newCellD = CellModel.create(3, 3);
      this.liveCells.addCell(newCellA);
      this.liveCells.addCell(newCellB);
      this.liveCells.addCell(newCellC);
      this.liveCells.addCell(newCellD);
      this.board.spawn();
      this.liveCells = this.board.liveCells;
      expect(this.liveCells.length).to.equal(4);
      expect(this.liveCells.getCellAt(2, 2)).to.not.equal(void 0);
      expect(this.liveCells.getCellAt(2, 3)).to.not.equal(void 0);
      expect(this.liveCells.getCellAt(3, 2)).to.not.equal(void 0);
      return expect(this.liveCells.getCellAt(3, 3)).to.not.equal(void 0);
    });
    return it("should exhibit blinker pattern", function() {
      var newCellA, newCellB, newCellC;
      newCellA = CellModel.create(2, 2);
      newCellB = CellModel.create(2, 3);
      newCellC = CellModel.create(2, 4);
      this.liveCells.addCell(newCellA);
      this.liveCells.addCell(newCellB);
      this.liveCells.addCell(newCellC);
      this.board.spawn();
      this.liveCells = this.board.liveCells;
      expect(this.liveCells.length).to.equal(3);
      expect(this.liveCells.getCellAt(1, 3)).to.not.equal(void 0);
      expect(this.liveCells.getCellAt(2, 3)).to.not.equal(void 0);
      return expect(this.liveCells.getCellAt(3, 3)).to.not.equal(void 0);
    });
  });
  
});
window.require.register("test/models/cell", function(exports, require, module) {
  var CellModel, EnvironmentModel;

  CellModel = require("models/Cell");

  EnvironmentModel = require("models/Environment");

  describe("Model Cell", function() {
    beforeEach(function() {
      this.environment = EnvironmentModel.create(20, 20);
      this.targetCell = CellModel.create(2, 2);
      this.nCell = CellModel.create(2, 1);
      this.nwCell = CellModel.create(1, 1);
      this.sCell = CellModel.create(2, 3);
      this.seCell = CellModel.create(3, 3);
      this.eCell = CellModel.create(3, 2);
      return this.wCell = CellModel.create(1, 2);
    });
    afterEach(function() {
      this.environment.dispose();
      expect(EnvironmentModel.getPool().usedList.length()).to.equal(0);
      return expect(CellModel.getPool().usedList.length()).to.equal(0);
    });
    it("should die if alone", function() {
      expect(this.targetCell.canSurviveIn(this.environment)).to.equal(false);
      this.targetCell.dispose();
      this.nCell.dispose();
      this.nwCell.dispose();
      this.sCell.dispose();
      this.seCell.dispose();
      this.eCell.dispose();
      return this.wCell.dispose();
    });
    it("should die if one neighbor", function() {
      this.environment.addCell(this.nCell);
      expect(this.targetCell.canSurviveIn(this.environment)).to.equal(false);
      this.targetCell.dispose();
      this.nwCell.dispose();
      this.sCell.dispose();
      this.seCell.dispose();
      this.eCell.dispose();
      return this.wCell.dispose();
    });
    it("should know how many neighbors it has", function() {
      var anotherCell;
      anotherCell = CellModel.create(12, 13);
      this.environment.addCell(this.nCell);
      this.environment.addCell(this.nwCell);
      this.environment.addCell(anotherCell);
      expect(this.targetCell.numberOfNeighborsIn(this.environment)).to.equal(2);
      this.targetCell.dispose();
      this.sCell.dispose();
      this.seCell.dispose();
      this.eCell.dispose();
      return this.wCell.dispose();
    });
    it("should not be a neighbor of itself", function() {
      this.environment.addCell(this.targetCell);
      expect(this.targetCell.numberOfNeighborsIn(this.environment)).to.equal(0);
      this.nCell.dispose();
      this.nwCell.dispose();
      this.sCell.dispose();
      this.seCell.dispose();
      this.eCell.dispose();
      return this.wCell.dispose();
    });
    it("should survive if two or three neighbors", function() {
      this.environment.addCell(this.sCell);
      this.environment.addCell(this.wCell);
      expect(this.targetCell.canSurviveIn(this.environment)).to.equal(true);
      this.environment.addCell(this.nCell);
      expect(this.targetCell.canSurviveIn(this.environment)).to.equal(true);
      this.targetCell.dispose();
      this.nwCell.dispose();
      this.seCell.dispose();
      return this.eCell.dispose();
    });
    return it("should die if four neighbors", function() {
      this.environment.addCell(this.nCell);
      this.environment.addCell(this.eCell);
      this.environment.addCell(this.nwCell);
      this.environment.addCell(this.seCell);
      expect(this.targetCell.canSurviveIn(this.environment)).to.equal(false);
      this.targetCell.dispose();
      this.sCell.dispose();
      return this.wCell.dispose();
    });
  });
  
});
window.require.register("test/models/environment", function(exports, require, module) {
  var EnvironmentModel;

  EnvironmentModel = require("models/Environment");

  describe("Model Environment", function() {
    beforeEach(function() {
      this.environmentWidth = 20;
      this.environmentHeight = 20;
      this.environment = EnvironmentModel.create(this.environmentWidth, this.environmentHeight);
      return this.item = {
        x: 0,
        y: 0
      };
    });
    afterEach(function() {
      this.environment.dispose();
      return expect(EnvironmentModel.getPool().usedList.length()).to.equal(0);
    });
    it("should add and retreive items", function() {
      this.environment.addCell(this.item);
      return expect(this.environment.getCellAt(this.item.x, this.item.y)).to.equal(this.item);
    });
    it("should have a length", function() {
      var otherItem;
      expect(this.environment.length).to.equal(0);
      this.environment.addCell(this.item);
      expect(this.environment.length).to.equal(1);
      this.environment.addCell(this.item);
      expect(this.environment.length).to.equal(1);
      otherItem = {
        x: 1,
        y: 1
      };
      this.environment.addCell(otherItem);
      return expect(this.environment.length).to.equal(2);
    });
    return it("should get cells with indices out of bounds", function() {
      this.environment.addCell(this.item);
      return expect(this.environment.getCellAt(this.item.x - this.environmentWidth, this.item.y + this.environmentHeight)).to.equal(this.item);
    });
  });
  
});
window.require.register("test/views/board", function(exports, require, module) {
  var BoardModel, BoardView, CellModel, CellView, EnvironmentModel;

  BoardView = require("views/Board");

  BoardModel = require("models/Board");

  CellModel = require("models/Cell");

  EnvironmentModel = require("models/Environment");

  CellView = require("views/Cell");

  describe("View Board", function() {
    beforeEach(function() {
      this.boardModel = BoardModel.create(20, 20);
      return this.boardView = BoardView.create(this.boardModel);
    });
    afterEach(function() {
      this.boardView.dispose();
      this.boardModel.dispose();
      expect(BoardView.getPool().usedList.length()).to.equal(0);
      expect(BoardModel.getPool().usedList.length()).to.equal(0);
      expect(CellModel.getPool().usedList.length()).to.equal(0);
      expect(EnvironmentModel.getPool().usedList.length()).to.equal(0);
      return expect(CellView.getPool().usedList.length()).to.equal(0);
    });
    it("should add cell views for board", function() {
      var liveCells;
      liveCells = this.boardModel.liveCells;
      liveCells.addCell(CellModel.create(1, 1));
      return expect(this.boardView.el.children.length).to.equal(1);
    });
    return it("should remove cells from board when they die", function() {
      var liveCells;
      liveCells = this.boardModel.liveCells;
      liveCells.addCell(CellModel.create(3, 6));
      expect(this.boardView.el.children.length).to.equal(1);
      this.boardModel.spawn();
      return expect(this.boardView.el.children.length).to.equal(0);
    });
  });
  
});
