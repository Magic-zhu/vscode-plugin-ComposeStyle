
const border = require('./rules/border')
const margin = require('./rules/margin')
const padding = require('./rules/padding')

const RULES = [
    "position", "z-index", "left", "right", "top", "bottom", "clip","float",
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