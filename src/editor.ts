import * as vscode from 'vscode';

export function write(content): Thenable<boolean> {
    let startLine = vscode.window.activeTextEditor.selection.start.line;
    var selection = vscode.window.activeTextEditor.selection;
    let position = new vscode.Position(startLine, selection.start.character);
    return vscode.window.activeTextEditor.edit((editBuilder) => {
        editBuilder.insert(position, content);
    });
}

export function replace(originalContent: string, newContent: string) {

    let document = vscode.window.activeTextEditor.document;
    let range: vscode.Range;
    let line: String;
    for (var i = 0; i < document.lineCount; i++) {
        line = document.lineAt(i).text;

        if (line.includes(originalContent)) {
            range = document.lineAt(i).range;
            break;
        }
    }

    if (range == undefined) {
        return;
    }

    const start = new vscode.Position(range.start.line, line.indexOf(originalContent));
    const end = new vscode.Position(range.start.line, start.character + originalContent.length);

    vscode.window.activeTextEditor.edit((editBuilder) => {
        const newRange = new vscode.Range(start, end);
        editBuilder.replace(newRange, newContent);

        const vsEditor = vscode.window.activeTextEditor;        
        const position = vsEditor.selection.active;

        const newPosition = position.with(position.line, 0);
        vsEditor.selection = new vscode.Selection(newPosition, newPosition);
    });
}
