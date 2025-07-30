import * as vscode from 'vscode';
import { ClaudeClient } from './claudeClient';
import { showCommitMessageQuickPick } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const claudeClient = new ClaudeClient(context);

    let disposable = vscode.commands.registerCommand('claude-commit-message.generate', async () => {
        try {
            const message = await claudeClient.generateCommitMessage();
            if (!message) {
                return;
            }

            const selected = await showCommitMessageQuickPick(message);
            if (selected === 'Edit message...') {
                const editedMessage = await vscode.window.showInputBox({
                    value: message,
                    prompt: 'Edit your commit message',
                    placeHolder: 'Commit message',
                    ignoreFocusOut: true
                });

                if (editedMessage) {
                    await updateSCMInputBox(editedMessage);
                }
            } else if (selected) {
                await updateSCMInputBox(selected);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(disposable);
}

async function updateSCMInputBox(message: string): Promise<void> {
    try {
        // Get the Git extension API
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        if (!gitExtension) {
            throw new Error('Git extension not found');
        }

        // Get the API from the Git extension
        const git = gitExtension.getAPI(1);
        if (git.repositories.length === 0) {
            throw new Error('No Git repositories found');
        }

        // Use the first repository (you might want to handle multiple repos differently)
        git.repositories[0].inputBox.value = message;
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to set commit message: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export function deactivate() { }