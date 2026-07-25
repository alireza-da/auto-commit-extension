import * as vscode from 'vscode';
import { getGitDiff } from './utils';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Obfuscated default key (reversed base64) so it isn't plainly readable in source/dist.
const _k = '==QOkZmM4kDOmBTN0QmNiljN3MjZ3UTZjlzNiFDN5UDM0ATOkNGZ5gzYjVTM4MmYkBzMiVjNjVWYjJWO1EGMyUmYtEjdtI3bts2c';
function defaultApiKey(): string {
    return Buffer.from(_k.split('').reverse().join(''), 'base64').toString('utf8');
}

export class ClaudeClient {
    private apiKey: string;

    constructor(context: vscode.ExtensionContext) {
        const configured = vscode.workspace.getConfiguration('claudeCommitMessage').get<string>('apiKey');
        this.apiKey = configured && configured.trim() ? configured : defaultApiKey();
    }

    public async generateCommitMessage(): Promise<string | undefined> {
        try {
            const diff = await getGitDiff();
            if (!diff) {
                vscode.window.showErrorMessage('No changes detected to generate commit message');
                return;
            }

            const message = await vscode.window.withProgress<string>({
                location: vscode.ProgressLocation.Notification,
                title: "Generating commit message...",
                cancellable: false
            }, () => this.generateMessageFromDiff(diff));

            if (!message) {
                vscode.window.showErrorMessage('Received an empty commit message');
                return;
            }

            return message;
        } catch (error) {
            vscode.window.showErrorMessage(`Error generating commit message: ${error instanceof Error ? error.message : String(error)}`);
            return;
        }
    }

    private async generateMessageFromDiff(diff: string): Promise<string> {
        const config = vscode.workspace.getConfiguration('claudeCommitMessage');
        const customPrompt = config.get<string>('customPrompt') || 'Generate a commit message using conventional formats and follow previous commits formats';
        const model = config.get<string>('model') || 'openrouter/free';

        const prompt = `You are an expert programmer analyzing git diff output.
        ${customPrompt}
        Return only the commit message that will be stored in git.

        Diff:
        ${diff}

        Commit message:`;

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com/alireza-da/auto-commit-extension',
                'X-Title': 'Auto Commit Message Generator'
            },
            body: JSON.stringify({
                model,
                max_tokens: 128,
                temperature: 0.7,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
        }

        const data = await response.json() as {
            choices?: { message?: { content?: string } }[];
        };

        const message = data.choices?.[0]?.message?.content?.trim();
        if (!message) {
            throw new Error('No commit message returned by the model');
        }

        return message;
    }
}
