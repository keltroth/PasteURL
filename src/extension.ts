'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as copyPaste from "copy-paste";

var isURL = require('is-url');
var articleTitle = require('article-title')
var request = require('request');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pasteurl" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        Paster.paste()
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

class Paster {
    public static paste() {
        copyPaste.paste((error, content) => {
            if (content && isURL(content)) {
                generateMarkDownStyleLink(content)
            }
        })
    }
}

function generateMarkDownStyleLink(url) {
    function requestResponseHandler(error, response, body) {
        var title;

        if (!error && response.statusCode === 200) {
            var re =  /<title.*?>\s*(.*?)\s*<\/title/g;
            var match = re.exec(body)
            title = match[1]
            var result = '[' + title + ']' + '(' + url + ')'
            writeToEditor(result)
        }
     }

    request(url, requestResponseHandler);
}

function writeToEditor(content) {
    vscode.window.activeTextEditor.edit((editBuilder) => {
        let startLine = vscode.window.activeTextEditor.selection.start.line;
        let lastCharIndex = vscode.window.activeTextEditor.document.lineAt(startLine).text.length;
        let position = new vscode.Position(startLine, lastCharIndex);
        editBuilder.insert(position, content);

    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}