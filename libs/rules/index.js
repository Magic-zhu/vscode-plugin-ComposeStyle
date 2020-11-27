const position = require('./position')
const border = require('./border')
const margin = require('./margin')
const padding = require('./padding')
const flex = require('./flex')
const background = require('./background')
const dimension = require('./dimension')
const text = require('./text')
const RULES = [
    ...position,
    ...flex,
    ...dimension,
    ...margin,
    ...padding,
    ...background,
    ...border,
    ...text,
    "content", "box-shadow", "animation", "transform"
]

module.exports = RULES