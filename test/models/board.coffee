BoardModel = require "models/Board"
CellModel = require "models/Cell"

describe "Model Board", ->
  beforeEach ->
    @board = new BoardModel 20, 20
    @liveCells = @board.liveCells

  it "should contain no live cells when created", ->
    expect(@liveCells.length).to.equal 0

  it "should spawn no live cells if seeded empty", ->
    @board.spawn()

    expect(@liveCells.length).to.equal 0

  it "should fire a cellAdded event when a cell is added", ->
    wasCalled = false
    newCell = new CellModel 2, 2

    jQuery(window).bind "!cellAdded", (jqEvent, cell) ->
      wasCalled = true if cell is newCell

    @liveCells.addCell newCell

    expect(wasCalled).to.equal true

  it "should fire a cellRemoved event when a cell is removed", ->
    wasCalled = false
    newCell = new CellModel 2, 2

    jQuery(window).bind "!cellRemoved", (jqEvent, cell) ->
      wasCalled = true if cell is newCell

    @liveCells.addCell newCell

    @board.spawn()

    expect(wasCalled).to.equal true

  it "should spawn no live cells if seeded with one cell", ->
    @liveCells.addCell new CellModel 2, 2
    @board.spawn()

    expect(@board.liveCells.length).to.equal 0

  it "should spawn no live cells if seeded with two neighboring cells", ->
    @liveCells.addCell new CellModel 2, 2
    @liveCells.addCell new CellModel 2, 3
    @board.spawn()

    expect(@board.liveCells.length).to.equal 0

  it "should exhibit the block pattern", ->
    @liveCells.addCell new CellModel 2, 2
    @liveCells.addCell new CellModel 2, 3
    @liveCells.addCell new CellModel 3, 2
    @liveCells.addCell new CellModel 3, 3
    @board.spawn()

    @liveCells = @board.liveCells

    expect(@liveCells.length).to.equal 4

    expect(@liveCells.getCellAt 2, 2).to.not.equal undefined
    expect(@liveCells.getCellAt 2, 3).to.not.equal undefined
    expect(@liveCells.getCellAt 3, 2).to.not.equal undefined
    expect(@liveCells.getCellAt 3, 3).to.not.equal undefined

  it "should exhibit blinker pattern", ->
    @liveCells.addCell new CellModel 2, 2
    @liveCells.addCell new CellModel 2, 3
    @liveCells.addCell new CellModel 2, 4
    @board.spawn()

    @liveCells = @board.liveCells

    expect(@liveCells.length).to.equal 3

    expect(@liveCells.getCellAt 1, 3).to.not.equal undefined
    expect(@liveCells.getCellAt 2, 3).to.not.equal undefined
    expect(@liveCells.getCellAt 3, 3).to.not.equal undefined
