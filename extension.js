
const vscode = require('vscode');
const parse = require('./libs/parse');
const fs = require('fs');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	vscode.window.setStatusBarMessage('ComposeStyle Active');

	let formatStyle = vscode.commands.registerCommand('extension.compose.formatStyle', (uri) => {
		let type;
		if (uri.path.endsWith('.css')) {
			type = 'css'
		} else if (uri.path.endsWith('.scss')) {
			type = 'scss'
		} else if (uri.path.endsWith('.less')) {
			type = 'less'
		} else {
			return
		}
		fs.readFile(uri.path, (err, buffer) => {
			if (err) {
				vscode.window.showErrorMessage('something wrong')
				return
			}
			let data = parse(buffer.toString(), { parser: type }, () => {
				vscode.window.showErrorMessage('检测到不支持的语法')
			})
			fs.writeFile(uri.path, data, (err) => {
				if (err) {
					vscode.window.showErrorMessage('something wrong')
					return
				}
			})
		})
	})
	context.subscriptions.push(formatStyle);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
