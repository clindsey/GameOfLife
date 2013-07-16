BoardView = require "views/Board"
BoardModel = require "models/Board"
CellModel = require "models/Cell"

describe "View Board", ->
  beforeEach ->
    @boardModel = new BoardModel 20, 20
    @boardView = new BoardView @boardModel

  afterEach ->
    @boardView.dispose()

  it "should add cell views for board", ->
    liveCells = @boardModel.liveCells

    liveCells.addCell new CellModel 1, 1

    expect(@boardView.el.children.length).to.equal 1

  it "should remove cells from board when they die", ->
    liveCells = @boardModel.liveCells

    liveCells.addCell new CellModel 3, 6

    expect(@boardView.el.children.length).to.equal 1

    @boardModel.spawn()

    expect(@boardView.el.children.length).to.equal 0
