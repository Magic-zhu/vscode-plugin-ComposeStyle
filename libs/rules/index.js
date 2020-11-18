const position = require('./position')
const border = require('./border')
const margin = require('./margin')
const padding = require('./padding')

const RULES = [
    ...position,
    "display","align-items","justify-content","flex-direction","flex-wrap",
    "overflow","visibility",
    "width", "height", "min-height", "max-height", "min-width", "max-width",
    ...margin,
    ...padding,
    "color", "font-size", "letter-spacing", "color", "text-align",
    "background", "background-image", 
    "border","border-radius",
    ...border,
    "line-height","text-align", "vertical-align", "text-wrap", "text-transform", "text-indent", "text-decoration", "letter-spacing", "word-spacing", "white-space", "text-overflow",
    "content", "box-shadow", "animation", "transform"
]

module.exports = RULES