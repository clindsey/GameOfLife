CellModel = require "models/Cell"
EnvironmentModel = require "models/Environment"

describe "Model Cell", ->
  beforeEach ->
    @environment = new EnvironmentModel 20, 20

    @targetCell = new CellModel 2, 2

    @nCell = new CellModel 2, 1
    @nwCell = new CellModel 1, 1
    @sCell = new CellModel 2, 3
    @seCell = new CellModel 3, 3
    @eCell = new CellModel 3, 2
    @wCell = new CellModel 1, 2

  it "should die if alone", ->
    expect(@targetCell.canSurviveIn @environment).to.equal false

  it "should die if one neighbor", ->
    @environment.addCell @nCell

    expect(@targetCell.canSurviveIn @environment).to.equal false

  it "should know how many neighbors it has", ->
    @environment.addCell @nCell
    @environment.addCell @nwCell
    @environment.addCell new CellModel 12, 13

    expect(@targetCell.numberOfNeighborsIn @environment).to.equal 2

  it "should not be a neighbor of itself", ->
    @environment.addCell @targetCell

    expect(@targetCell.numberOfNeighborsIn @environment).to.equal 0

  it "should survive if two or three neighbors", ->
    @environment.addCell @sCell
    @environment.addCell @wCell
    expect(@targetCell.canSurviveIn @environment).to.equal true

    @environment.addCell @nCell
    expect(@targetCell.canSurviveIn @environment).to.equal true

  it "should die if four neighbors", ->
    @environment.addCell @nCell
    @environment.addCell @eCell
    @environment.addCell @nwCell
    @environment.addCell @seCell

    expect(@targetCell.canSurviveIn @environment).to.equal false
