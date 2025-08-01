"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ClaudeClient = void 0;
var sdk_1 = require("@anthropic-ai/sdk");
var vscode = require("vscode");
var utils_1 = require("./utils");
var ClaudeClient = /** @class */ (function () {
    function ClaudeClient(context) {
        this.apiKey = vscode.workspace.getConfiguration('claudeCommitMessage').get('apiKey');
        this.anthropic = new sdk_1.Anthropic({
            apiKey: this.apiKey
        });
    }
    ClaudeClient.prototype.generateCommitMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, diff_1, message, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!!this.apiKey) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.promptForApiKey()];
                    case 1:
                        _a.apiKey = _b.sent();
                        if (!this.apiKey) {
                            vscode.window.showErrorMessage('Claude API key is required');
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2: return [4 /*yield*/, (0, utils_1.getGitDiff)()];
                    case 3:
                        diff_1 = _b.sent();
                        if (!diff_1) {
                            vscode.window.showErrorMessage('No changes detected to generate commit message');
                            return [2 /*return*/];
                        }
                        vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: "Generating commit message with Claude...",
                            cancellable: false
                        }, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.generateMessageFromDiff(diff_1)];
                            });
                        }); });
                        return [4 /*yield*/, this.generateMessageFromDiff(diff_1)];
                    case 4:
                        message = _b.sent();
                        return [2 /*return*/, message];
                    case 5:
                        error_1 = _b.sent();
                        vscode.window.showErrorMessage("Error generating commit message: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                        return [2 /*return*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ClaudeClient.prototype.generateMessageFromDiff = function (diff) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, response, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = "You are an expert programmer analyzing git diff output. \n        Generate a concise, clear commit message following conventional commit standards.\n        Focus on the why rather than the what, and group related changes logically.\n        \n        Diff:\n        ".concat(diff, "\n        \n        Commit message:");
                        return [4 /*yield*/, this.anthropic.messages.create({
                                model: "claude-3-opus-20240229",
                                max_tokens: 256,
                                temperature: 0.7,
                                messages: [
                                    {
                                        role: "user",
                                        content: prompt
                                    }
                                ]
                            })];
                    case 1:
                        response = _a.sent();
                        message = response.content[0].text.trim();
                        return [2 /*return*/, message];
                }
            });
        });
    };
    ClaudeClient.prototype.promptForApiKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, vscode.window.showInputBox({
                            prompt: 'Enter your Claude API key',
                            placeHolder: 'sk-...',
                            ignoreFocusOut: true,
                            password: true
                        })];
                    case 1:
                        apiKey = _a.sent();
                        if (!apiKey) return [3 /*break*/, 3];
                        return [4 /*yield*/, vscode.workspace.getConfiguration('claudeCommitMessage').update('apiKey', apiKey, vscode.ConfigurationTarget.Global)];
                    case 2:
                        _a.sent();
                        this.anthropic = new sdk_1.Anthropic({ apiKey: apiKey });
                        _a.label = 3;
                    case 3: return [2 /*return*/, apiKey];
                }
            });
        });
    };
    return ClaudeClient;
}());
exports.ClaudeClient = ClaudeClient;
