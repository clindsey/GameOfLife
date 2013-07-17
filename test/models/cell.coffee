CellModel = require "models/Cell"
EnvironmentModel = require "models/Environment"

describe "Model Cell", ->
  beforeEach ->
    @environment = EnvironmentModel.create 20, 20

    @targetCell = CellModel.create 2, 2

    @nCell = CellModel.create 2, 1
    @nwCell = CellModel.create 1, 1
    @sCell = CellModel.create 2, 3
    @seCell = CellModel.create 3, 3
    @eCell = CellModel.create 3, 2
    @wCell = CellModel.create 1, 2

  afterEach ->
    @environment.dispose()

    expect(EnvironmentModel.getPool().usedList.length()).to.equal 0
    expect(CellModel.getPool().usedList.length()).to.equal 0

  it "should die if alone", ->
    expect(@targetCell.canSurviveIn @environment).to.equal false

    @targetCell.dispose()
    @nCell.dispose()
    @nwCell.dispose()
    @sCell.dispose()
    @seCell.dispose()
    @eCell.dispose()
    @wCell.dispose()

  it "should die if one neighbor", ->
    @environment.addCell @nCell

    expect(@targetCell.canSurviveIn @environment).to.equal false

    @targetCell.dispose()
    @nwCell.dispose()
    @sCell.dispose()
    @seCell.dispose()
    @eCell.dispose()
    @wCell.dispose()

  it "should know how many neighbors it has", ->
    anotherCell = CellModel.create 12, 13

    @environment.addCell @nCell
    @environment.addCell @nwCell
    @environment.addCell anotherCell

    expect(@targetCell.numberOfNeighborsIn @environment).to.equal 2

    @targetCell.dispose()
    @sCell.dispose()
    @seCell.dispose()
    @eCell.dispose()
    @wCell.dispose()

  it "should not be a neighbor of itself", ->
    @environment.addCell @targetCell

    expect(@targetCell.numberOfNeighborsIn @environment).to.equal 0

    @nCell.dispose()
    @nwCell.dispose()
    @sCell.dispose()
    @seCell.dispose()
    @eCell.dispose()
    @wCell.dispose()

  it "should survive if two or three neighbors", ->
    @environment.addCell @sCell
    @environment.addCell @wCell
    expect(@targetCell.canSurviveIn @environment).to.equal true

    @environment.addCell @nCell
    expect(@targetCell.canSurviveIn @environment).to.equal true

    @targetCell.dispose()
    @nwCell.dispose()
    @seCell.dispose()
    @eCell.dispose()

  it "should die if four neighbors", ->
    @environment.addCell @nCell
    @environment.addCell @eCell
    @environment.addCell @nwCell
    @environment.addCell @seCell

    expect(@targetCell.canSurviveIn @environment).to.equal false

    @targetCell.dispose()
    @sCell.dispose()
    @wCell.dispose()
