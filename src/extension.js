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
exports.deactivate = exports.activate = void 0;
var vscode = require("vscode");
var claudeClient_1 = require("./claudeClient");
var utils_1 = require("./utils");
function activate(context) {
    var _this = this;
    var claudeClient = new claudeClient_1.ClaudeClient(context);
    var disposable = vscode.commands.registerCommand('claude-commit-message.generate', function () { return __awaiter(_this, void 0, void 0, function () {
        var message, selected, editedMessage, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, claudeClient.generateCommitMessage()];
                case 1:
                    message = _a.sent();
                    if (!message) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, utils_1.showCommitMessageQuickPick)(message)];
                case 2:
                    selected = _a.sent();
                    if (!(selected === 'Edit message...')) return [3 /*break*/, 6];
                    return [4 /*yield*/, vscode.window.showInputBox({
                            value: message,
                            prompt: 'Edit your commit message',
                            placeHolder: 'Commit message',
                            ignoreFocusOut: true
                        })];
                case 3:
                    editedMessage = _a.sent();
                    if (!editedMessage) return [3 /*break*/, 5];
                    return [4 /*yield*/, updateSCMInputBox(editedMessage)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    if (!selected) return [3 /*break*/, 8];
                    return [4 /*yield*/, updateSCMInputBox(selected)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    vscode.window.showErrorMessage("Error: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function updateSCMInputBox(message) {
    return __awaiter(this, void 0, void 0, function () {
        var scmProvider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.commands.executeCommand('workbench.view.scm')];
                case 1:
                    _a.sent();
                    scmProvider = vscode.scm.activeProvider;
                    if (scmProvider) {
                        scmProvider.inputBox.value = message;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function deactivate() { }
exports.deactivate = deactivate;
