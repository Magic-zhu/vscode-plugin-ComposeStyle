
const vscode = require('vscode');
const parse = require('./libs/parse');
const fs = require('fs');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	vscode.window.setStatusBarMessage('ComposeStyle Active');

	let formatStyle = vscode.commands.registerCommand('extension.compose.formatStyle', (uri) => {
		const path = uri.fsPath
		let type;
		if (path.endsWith('.css')) {
			type = 'css'
		} else if (path.endsWith('.scss')) {
			type = 'scss'
		} else if (path.endsWith('.less')) {
			type = 'less'
		} else {
			return
		}
		fs.readFile(path, (err, buffer) => {
			if (err) {
				vscode.window.showErrorMessage('something wrong')
				return
			}
			let data = parse(buffer.toString(), { parser: type }, () => {
				vscode.window.showErrorMessage('检测到不支持的语法')
			})
			fs.writeFile(path, data, (err) => {
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
