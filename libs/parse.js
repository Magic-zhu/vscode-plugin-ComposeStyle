const prettier = require("prettier");
function dropAnnotation(css) {
    let status = 0;
    let pos = 0;
    let r = ''
    for (let i = 0; i < css.length; i++) {
        // console.log(css[i])
        if (css[i] == '/' && css[i + 1] == '/' && status == 0) {
            r = r +css.substring(pos, i)
            status = 1
            pos = i
        } else if (
            (css[i] == ' ' && status==1)
        ) {
            status = 0
            pos = i+1
        }
    }
    r = r +css.substring(pos, css.length)
    return r
}
function transform(css) {
    css = dropAnnotation(css);
    let attrsArray = css.replace(/\n/g, '').split(';');
    attrsArray.pop();
    let attrs = {};
    attrsArray.forEach(element => {
        let p = element.split(':');
        if (element) attrs[p[0].replace(/\s/g, '')] = p[1].trim();
    })
    const RULES = [
        "position", "z-index", "left", "right", "top", "bottom", "clip",
        "width", "height", "min-height", "max-height", "min-width", "max-width",
        "color", "font-size", "letter-spacing", "color", "text-align",
        "background", "background-image", "border",
        "text-align", "vertical-align", "text-wrap", "text-transform", "text-indent", "text-decoration", "letter-spacing", "word-spacing", "white-space", "text-overflow",
        "content", "box-shadow", "animation", "border-radius", "transform"
    ]
    let newAttrs = ''
    RULES.forEach((item) => {
        if (attrs[item]) {
            newAttrs = newAttrs + item + ":" + attrs[item] + ";";
            delete attrs[item];
        }
    })
    Object.keys(attrs).forEach(item => {
        newAttrs = newAttrs + item + ":" + attrs[item] + ";";
    })
    return newAttrs
}

function parse(css, options = {}) {
    let status = 'normal';
    let slicePosition = 0;
    let result = [];
    for (let i = 0; i < css.length; i++) {
        if (css[i] == '{' && status == 'normal') {
            status = 'start'
            result.push(css.substring(slicePosition, i + 1))
            slicePosition = i + 1;
        } else if (css[i] == '{' && status == 'start') {
            let str = css.substring(slicePosition, i + 1);
            let pos = str.lastIndexOf(';');
            if (pos !== -1) {
                result.push(transform(str.substring(0, pos + 1)))
                result.push(str.substring(pos + 1, str.length))
            } else {
                result.push(str)
            }
            slicePosition = i + 1;
        } else if (css[i] == '}' && status == 'start') {
            let attrs = transform(css.substring(slicePosition, i))
            result.push(attrs);
            slicePosition = i;
            status = 'normal'
        }
    }
    result.push(css.substring(slicePosition, css.length))
    let newCss = result.reduce((s, a) => s + a)
    try {
        newCss = prettier.format(newCss, { parser: options.parser || 'css' })
    } catch (error) {

    }
    return newCss
}

module.exports = parse