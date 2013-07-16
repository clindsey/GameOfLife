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

    @el.graphics.beginFill @styles.fill
    @el.graphics.setStrokeStyle 0.5
    @el.graphics.beginStroke @styles.stroke
    @el.graphics.drawRect 0, 0, width, height
    @el.graphics.endFill()
