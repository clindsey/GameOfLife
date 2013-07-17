BoardView = require "views/Board"
BoardModel = require "models/Board"
CellModel = require "models/Cell"
EnvironmentModel = require "models/Environment"
CellView = require "views/Cell"

describe "View Board", ->
  beforeEach ->
    @boardModel = BoardModel.create 20, 20
    @boardView = BoardView.create @boardModel

  afterEach ->
    @boardView.dispose()
    @boardModel.dispose()

    expect(BoardView.getPool().usedList.length()).to.equal 0
    expect(BoardModel.getPool().usedList.length()).to.equal 0
    expect(CellModel.getPool().usedList.length()).to.equal 0
    expect(EnvironmentModel.getPool().usedList.length()).to.equal 0
    expect(CellView.getPool().usedList.length()).to.equal 0

  it "should add cell views for board", ->
    liveCells = @boardModel.liveCells

    liveCells.addCell CellModel.create 1, 1

    expect(@boardView.el.children.length).to.equal 1

  it "should remove cells from board when they die", ->
    liveCells = @boardModel.liveCells

    liveCells.addCell CellModel.create 3, 6

    expect(@boardView.el.children.length).to.equal 1

    @boardModel.spawn()

    expect(@boardView.el.children.length).to.equal 0
