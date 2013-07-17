BoardModel = require "models/Board"
CellModel = require "models/Cell"
EnvironmentModel = require "models/Environment"

describe "Model Board", ->
  beforeEach ->
    @board = BoardModel.create 20, 20
    @liveCells = @board.liveCells

  afterEach ->
    @board.dispose()

    expect(BoardModel.getPool().usedList.length()).to.equal 0
    expect(CellModel.getPool().usedList.length()).to.equal 0
    expect(EnvironmentModel.getPool().usedList.length()).to.equal 0

  it "should contain no live cells when created", ->
    expect(@liveCells.length).to.equal 0

  it "should spawn no live cells if seeded empty", ->
    @board.spawn()

    expect(@liveCells.length).to.equal 0

  it "should fire a cellAdded event when a cell is added", ->
    wasCalled = false
    newCell = CellModel.create 2, 2

    EventBus.addEventListener "!cellAdded", (jqEvent, cell) ->
      wasCalled = true if cell is newCell

    @liveCells.addCell newCell

    expect(wasCalled).to.equal true

  it "should fire a cellRemoved event when a cell is removed", ->
    wasCalled = false
    newCell = CellModel.create 2, 2

    EventBus.addEventListener "!cellRemoved", (jqEvent, cell) ->
      wasCalled = true if cell is newCell

    @liveCells.addCell newCell

    @board.spawn()

    expect(wasCalled).to.equal true

  it "should spawn no live cells if seeded with one cell", ->
    newCell = CellModel.create 2, 2
    @liveCells.addCell newCell
    @board.spawn()

    expect(@board.liveCells.length).to.equal 0

  it "should spawn no live cells if seeded with two neighboring cells", ->
    newCellA = CellModel.create 2, 2
    newCellB = CellModel.create 2, 3

    @liveCells.addCell newCellA
    @liveCells.addCell newCellB
    @board.spawn()

    expect(@board.liveCells.length).to.equal 0

  it "should exhibit the block pattern", ->
    newCellA = CellModel.create 2, 2
    newCellB = CellModel.create 2, 3
    newCellC = CellModel.create 3, 2
    newCellD = CellModel.create 3, 3

    @liveCells.addCell newCellA
    @liveCells.addCell newCellB
    @liveCells.addCell newCellC
    @liveCells.addCell newCellD
    @board.spawn()

    @liveCells = @board.liveCells

    expect(@liveCells.length).to.equal 4

    expect(@liveCells.getCellAt 2, 2).to.not.equal undefined
    expect(@liveCells.getCellAt 2, 3).to.not.equal undefined
    expect(@liveCells.getCellAt 3, 2).to.not.equal undefined
    expect(@liveCells.getCellAt 3, 3).to.not.equal undefined

  it "should exhibit blinker pattern", ->
    newCellA = CellModel.create 2, 2
    newCellB = CellModel.create 2, 3
    newCellC = CellModel.create 2, 4

    @liveCells.addCell newCellA
    @liveCells.addCell newCellB
    @liveCells.addCell newCellC
    @board.spawn()

    @liveCells = @board.liveCells

    expect(@liveCells.length).to.equal 3

    expect(@liveCells.getCellAt 1, 3).to.not.equal undefined
    expect(@liveCells.getCellAt 2, 3).to.not.equal undefined
    expect(@liveCells.getCellAt 3, 3).to.not.equal undefined
