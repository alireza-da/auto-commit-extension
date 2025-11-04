import { Anthropic } from '@anthropic-ai/sdk';
import * as vscode from 'vscode';
import { getGitDiff } from './utils';

export class ClaudeClient {
    private anthropic: Anthropic;
    private apiKey: string | undefined;

    constructor(context: vscode.ExtensionContext) {
        this.apiKey = vscode.workspace.getConfiguration('claudeCommitMessage').get('apiKey');
        this.anthropic = new Anthropic({
            apiKey: this.apiKey
        });
    }

    public async generateCommitMessage(): Promise<string | undefined> {
        try {
            if (!this.apiKey) {
                this.apiKey = await this.promptForApiKey();
                if (!this.apiKey) {
                    vscode.window.showErrorMessage('Claude API key is required');
                    return;
                }
            }

            const diff = await getGitDiff();
            if (!diff) {
                vscode.window.showErrorMessage('No changes detected to generate commit message');
                return;
            }

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Generating commit message with Claude...",
                cancellable: false
            }, async () => {
                return this.generateMessageFromDiff(diff);
            });

            const message = await this.generateMessageFromDiff(diff);
            return message;
        } catch (error) {
            vscode.window.showErrorMessage(`Error generating commit message: ${error instanceof Error ? error.message : String(error)}`);
            return;
        }
    }

    private async generateMessageFromDiff(diff: string): Promise<string> {
        const prompt = `You are an expert programmer analyzing git diff output.
        Generate a concise, clear commit message following conventional commit standards.
        Focus on the why rather than the what, and group related changes logically.
        Return only the commit message that will be sotred in git.

        Diff:
        ${diff}

        Commit message:`;

        const model = vscode.workspace.getConfiguration('claudeCommitMessage').get('model') || 'claude-3-5-sonnet-20241022';

        const response = await this.anthropic.messages.create({
            model: model as string,
            max_tokens: 128,
            temperature: 0.7,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const message = response.content[0].text.trim();
        return message;
    }

    private async promptForApiKey(): Promise<string | undefined> {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter your Claude API key',
            placeHolder: 'sk-...',
            ignoreFocusOut: true,
            password: true
        });

        if (apiKey) {
            await vscode.workspace.getConfiguration('claudeCommitMessage').update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
            this.anthropic = new Anthropic({ apiKey });
        }

        return apiKey;
    }
}