EnvironmentModel = require "models/Environment"

describe "Model Environment", ->
  beforeEach ->
    @environmentWidth = 20
    @environmentHeight = 20
    @environment = EnvironmentModel.create @environmentWidth, @environmentHeight

    @item = {x: 0, y: 0}

  afterEach ->
    @environment.dispose()

    expect(EnvironmentModel.getPool().usedList.length()).to.equal 0

  it "should add and retreive items", ->
    @environment.addCell @item

    expect(@environment.getCellAt(@item.x, @item.y)).to.equal @item

  it "should have a length", ->
    expect(@environment.length).to.equal 0

    @environment.addCell @item
    expect(@environment.length).to.equal 1

    @environment.addCell @item
    expect(@environment.length).to.equal 1

    otherItem = {x: 1, y: 1}
    @environment.addCell otherItem
    expect(@environment.length).to.equal 2

  it "should get cells with indices out of bounds", ->
    @environment.addCell @item

    expect(@environment.getCellAt(@item.x - @environmentWidth, @item.y + @environmentHeight)).to.equal @item
