module.exports = class CellView
  styles:
    width: 10
    height: 10
    fill: "#ccc"
    stroke: "#f00"

  constructor: (@model) ->
    @el = new createjs.Shape

    @drawingInstructions()

    @el.x = @styles.width * @model.x
    @el.y = @styles.height * @model.y

  drawingInstructions: ->
    width = @styles.width
    height = @styles.height

    graphics = @el.graphics

    graphics.beginFill @styles.fill
    graphics.setStrokeStyle 0.5
    graphics.beginStroke @styles.stroke
    graphics.drawRect 0, 0, width, height
    graphics.endFill()
