# Auto Commit Message Generator

Generate clean, conventional git commit messages from your staged changes — right inside VS Code's Source Control panel. Powered by AI via OpenRouter, with a free built-in tier so it works out of the box.

## Features

- **One-click generation** — click the wand icon in the Source Control title bar, or run the command from the palette.
- **Reads your staged diff** — analyzes `git diff --cached` so the message reflects exactly what you're about to commit.
- **Conventional Commits style** — follows conventional commit formatting and matches the style of your repo's recent commit history.
- **Review before committing** — pick the generated message, edit it inline, or discard it; nothing is committed automatically.
- **No API key required** — works out of the box on a free tier; bring your own OpenRouter key for full control over model and rate limits.
- **Configurable model & prompt** — choose any OpenRouter model and customize the instruction prompt sent to it.

## Usage

1. Stage your changes (`git add ...`).
2. Open the Source Control panel and click the **Generate Commit Message** wand icon (or run `Generate Commit Message` from the Command Palette).
3. Review the suggested message — accept it or choose **Edit message...** to tweak it.
4. Commit as usual.

## Requirements

- A Git repository open in the workspace.
- Changes staged for commit (`git diff --cached` must return output).

## Extension Settings

This extension contributes the following settings:

- **`claudeCommitMessage.apiKey`** — Optional: your own OpenRouter API key. Leave blank to use the built-in free tier. Default: `""`
- **`claudeCommitMessage.model`** — Which OpenRouter model to use for generation. Default: `openrouter/free`
- **`claudeCommitMessage.customPrompt`** — Custom instruction prompt sent to the model when generating commit messages. Default: `Generate a commit message using conventional formats and follow previous commits formats`

## Privacy

Your staged `git diff` is sent to OpenRouter's API to generate the commit message. No code is stored by this extension; review OpenRouter's policies if you have data-sensitivity requirements, and supply your own API key if you'd like control over which model processes your diffs.

## License

MIT — see [LICENSE.md](LICENSE.md).
