import * as vscode from 'vscode';
import * as child_process from 'child_process';

export function getGitDiff(): Promise<string> {
    return new Promise((resolve, reject) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            reject(new Error('No workspace folder open'));
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        child_process.exec('git diff --cached', { cwd: rootPath }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || 'Failed to get git diff'));
                return;
            }
            resolve(stdout);
        });
    });
}

export function showCommitMessageQuickPick(message: string): Thenable<string | undefined> {
    return vscode.window.showQuickPick([message, 'Edit message...'], {
        placeHolder: 'Generated commit message',
        title: 'Use this commit message?'
    });
}