import * as vscode from 'vscode';

interface ILinkFormatter {
    formatLink(title: string, url: string): string;
}

class MarkdownLinkFormatter implements ILinkFormatter {
    formatLink(title: string, url: string): string {
        return `[${title}](${url})`;
    }
}

class RestructuredTextLinkFormatter implements ILinkFormatter {
    formatLink(title: string, url: string): string {
        return `\`${title} <${url}>\`_`;
    }
}

class HtmlLinkFormatter implements ILinkFormatter {
    formatLink(title: string, url: string): string {
        return `<a href="${url}" title="${title}">${title}</a>`;
    }
}

class NoFormatter implements ILinkFormatter {
    formatLink(title: string, url: string): string {
        return url;
    }
}

function getLanguage() {
    const filename = vscode.window.activeTextEditor.document.fileName;
    if (filename.endsWith(".rst") ||
        filename.endsWith(".rest") ||
        filename.endsWith(".restx")) {
        return 'restructuredtext';
    }

    return vscode.window.activeTextEditor.document.languageId.toLowerCase();
}

export function getLinkFormatter() {
    if (getLanguage() == 'restructuredtext') {
        return new RestructuredTextLinkFormatter();
    } else if (getLanguage() == 'markdown') {
        return new MarkdownLinkFormatter();
    } else if (getLanguage() == 'html') {
        return new HtmlLinkFormatter();
    } else {
        return new NoFormatter();
    }
}
