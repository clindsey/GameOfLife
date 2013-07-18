View = require "views/base/View"

module.exports = View.extend 'CellView',
  {
    create: (model) ->
      cell = @_super()
      cell.el = new createjs.Shape

      cell.model = model

      cell.styles = {
        width: 10
        height: 10
        fill: "##{(Math.random()*0xFFFFFF<<0).toString(16)}"
      }

      cell.drawingInstructions()

      cell.el.x = cell.styles.width * model.x
      cell.el.y = cell.styles.height * model.y

      cell
  }, {
    drawingInstructions: ->
      width = @styles.width
      height = @styles.height

      graphics = @el.graphics

      graphics.beginFill @styles.fill
      graphics.drawRect 0, 0, width, height
      graphics.endFill()
  }
