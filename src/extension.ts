'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-pretty-config" is now active!');

    let wordCounter = new WordCounter();
    let controller = new WordCounterController(wordCounter);

    context.subscriptions.push(wordCounter);
    context.subscriptions.push(controller);
}

class WordCounter {
    constructor() {
        
    }

    private _statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    /**
     * updateWordCount
     */
    public updateWordCount() {
        
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;
        if (doc.languageId === "markdown") {
            let wordCount = this._getWordCount(doc);
            this._statusBarItem.text = wordCount !== 1 ? `$(pencil) ${wordCount} Words` : '1 Word';
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    private _getWordCount(doc: vscode.TextDocument) {
        let docContent = doc.getText();
        let wordCount = 0;
        if (docContent !== "") {
            wordCount = docContent.split(" ").length;
        }
        return wordCount;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

class WordCounterController {
    private _wordCounter: WordCounter;
    private _disposable: vscode.Disposable;
    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;

        let subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._wordCounter.updateWordCount();
        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    private _onEvent() {
        this._wordCounter.updateWordCount();
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}