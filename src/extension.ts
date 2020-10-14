'use strict';
import * as vscode from 'vscode';
import { paste } from './paster';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.pasteURL', paste));
}