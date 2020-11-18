
const vscode = require('vscode');
const parse = require('./libs/parse');
const fs = require('fs');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	vscode.window.setStatusBarMessage('ComposeStyle Active');
	let didSaveEvent = vscode.workspace.onDidSaveTextDocument((doc)=>{
		let type;  
		if(doc.fileName.endsWith('.css')){
			type='css'
		}else if(doc.fileName.endsWith('.scss')){
			type='scss'
		}else if(doc.fileName.endsWith('.less')){
			type='less'
		}else {
			return
		}
		fs.readFile(doc.fileName,(err,buffer)=>{
			if(err){
				vscode.window.showErrorMessage('something wrong')
				return
			}
			let data = parse(buffer.toString(),{parser:type},()=>{
				vscode.window.showErrorMessage('检测到不支持的语法')
			})
			fs.writeFile(doc.fileName,data,(err)=>{
				if(err){
					vscode.window.showErrorMessage('something wrong')
					return
				}
			})
		})
    })
    context.subscriptions.push(didSaveEvent);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
