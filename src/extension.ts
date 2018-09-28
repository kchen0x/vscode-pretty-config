'use strict';
import * as vscode from 'vscode';
import { registerContext, ContextType, enterContext, exitContext, restoreContext } from './context';


export function activate(ctx: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-pretty-config" is now active!');

    const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    registerContext(ContextType.TableMode, '$(book) Table Mode', statusItem);
    statusItem.show();

    let disposable = vscode.commands.registerCommand('extension.config.format', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let text = editor.document.getText();
        console.log(text);
    });

    ctx.subscriptions.push(disposable);

    // let wordCounter = new WordCounter();
    // let controller = new WordCounterController(wordCounter);

    // context.subscriptions.push(wordCounter);
    // context.subscriptions.push(controller);
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