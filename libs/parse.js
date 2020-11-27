const prettier = require("prettier")
const RULES = require('./rules')

function encode(input){
    let output;
    output = input.replace(/https:\/\//g, '@https@')
    output = output.replace(/http:\/\//g, '@http@')
    return output
}

function decode(input){
    let output;
    output = input.replace(/@https@/g, 'https://')
    output = output.replace(/@http@/g, 'http://')
    return output
}

//去除注释
function dropAnnotation(input) {
    let status = 0;
    let pos = 0;
    let r = ''
    let css = encode(input)
    for (let i = 0; i < css.length; i++) {
        if (css[i] == '/' && (css[i + 1] == '/' || css[i + 1] == '*') && status == 0) {
            r = r + css.substring(pos, i)
            status = 1
            pos = i
        } else if (
            (
                css[i].charCodeAt(0) == '0x0D' ||
                css[i].charCodeAt(0) == '0x0A' ||
                (css[i] == '/' && css[i - 1] == '*')
            ) && status == 1
        ) {
            status = 0
            pos = i + 1
        }
    }
    r = r + css.substring(pos, css.length)
    r = decode(r)
    return r
}
//属性排序
function transform(css) {
    css = dropAnnotation(css);
    let attrsArray = css.replace(/\n/g, '').split(';');
    attrsArray.pop();
    let newAttrs = '';
    let attrs = {};
    attrsArray.forEach(element => {
        let p = element.split(':')
        if (p.length > 2) { //处理存在多个:的情况
            let count = 2, final = p.length
            while (count < final) {
                p[1] = p[1] + ':' + p[count]
                count++
            }
        }
        if (p.length == 1) {
            newAttrs = newAttrs + p[0] + ';'
        } else if (element) {
            attrs[p[0].replace(/\s/g, '')] = p[1].trim();
        }
    })
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

function parse(css, options = {}, callback) {
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
        return newCss
    } catch (error) {
        callback(error)
        return css
    }
}

module.exports = parse