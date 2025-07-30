"use strict";
exports.__esModule = true;
exports.showCommitMessageQuickPick = exports.getGitDiff = void 0;
var vscode = require("vscode");
var child_process = require("child_process");
function getGitDiff() {
    return new Promise(function (resolve, reject) {
        var workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            reject(new Error('No workspace folder open'));
            return;
        }
        var rootPath = workspaceFolders[0].uri.fsPath;
        child_process.exec('git diff --cached', { cwd: rootPath }, function (error, stdout, stderr) {
            if (error) {
                reject(new Error(stderr || 'Failed to get git diff'));
                return;
            }
            resolve(stdout);
        });
    });
}
exports.getGitDiff = getGitDiff;
function showCommitMessageQuickPick(message) {
    return vscode.window.showQuickPick([message, 'Edit message...'], {
        placeHolder: 'Generated commit message',
        title: 'Use this commit message?'
    });
}
exports.showCommitMessageQuickPick = showCommitMessageQuickPick;
