import * as formatter from './formatters';
import * as editor from './editor';
import * as processor from './processor';
import * as vscode from 'vscode';
import * as copyPaste from 'copy-paste';

export function paste() {
    copyPaste.paste((error, content) => {
        if (content) {
            generateLink(content);
        } else {
            editor.write(error);
        }
    })
}

function generateLink(url: string) {
    const document = vscode.window.activeTextEditor.document;
    const selection = vscode.window.activeTextEditor.selection;
    const selectedText = document.getText(selection);
    const isSelectionEmpty = selectedText.length == 0;

    if (url.startsWith("http") && isSelectionEmpty) {
        composeTitleAndSelection(url);
    } else {
        vscode.commands.executeCommand('editor.action.clipboardPasteAction');
    }
}

async function composeTitleAndSelection(url: string) {
    const date = new Date();
    const seconds = date.getSeconds();
    const padding = seconds < 10 ? '0' : '';
    const timestamp = date.getMinutes() + ':' + padding + seconds;
    const fetchingTitle = 'Getting Title at ' + timestamp;

    await editor.write(fetchingTitle);
    const siteInfos = await processor.process(url);
    const formattedLink = formatter.getLinkFormatter().formatLink(siteInfos.title, siteInfos.href);
    editor.replace(fetchingTitle, formattedLink);
}