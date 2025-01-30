"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const ollama_1 = __importDefault(require("ollama"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "victory-ext" is now active!');
    const zazdingo = vscode.commands.registerCommand("victory-ext.start", () => {
        const panel = vscode.window.createWebviewPanel("zazdingo", "Zazdingo Chat", vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === "chat") {
                const userPrompt = message.text;
                let responseText = "";
                try {
                    const streamResponse = await ollama_1.default.chat({
                        model: "deepseek-r1:1.5b",
                        messages: [{ role: "user", content: userPrompt }],
                        stream: true,
                    });
                    for await (const part of streamResponse) {
                        responseText += part.message.content;
                        panel.webview.postMessage({
                            command: "chatResponse",
                            text: responseText,
                        });
                    }
                }
                catch (err) {
                    panel.webview.postMessage({
                        command: "chatResponse",
                        text: "Error",
                    });
                }
            }
        });
    });
    function getWebviewContent() {
        return /*html*/ `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Zazdingo Chat</title>
			<style>
        h1 {
          color: #3a86ff
        }
        body {
          font-family: sans-serif;
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        textarea {
          padding: 12px 20px;
          box-sizing: border-box;
          border: 4px outset #3a86ff;
          background-color: #f8f8f8;
          font-size: 0.75rem;
          resize: none;
        }
        textarea:selection {
          background: none;
        }
        button {
          background-color: #3a86ff;
          border: 2px solid #3a86ff;
          border-radius: 30px;
          box-shadow: rgb(18, 50, 103) 4px 4px 0 0;
          color: #f4f3ee;
          cursor: pointer;
          font-size: 1rem;
          padding: 4px 24px;
          text-decoration: none;
        }
        button:hover {
          background-color:rgb(18, 50, 103);
          border: 2px solid rgb(18, 50, 103);
        }
				#response {
          margin: 30px;
          padding: 30px;
          border: 4px outset #3a86ff;
          width: 700px;
          color: black;
          background-color: #f4f3ee;
        }
			</style>
		</head>
		<body>
      <h1>Zazdingo Chat</h1>
			<textarea id="prompt" rows="4" cols="50" placeholder="Ask something..."></textarea>
			<br>
			<button id="askBtn">Ask</button>
			<div id="response"></div>

			<script>
				const vscode = acquireVsCodeApi();

				document.getElementById('askBtn').addEventListener("click", () => {
					const text = document.getElementById("prompt").value;
					vscode.postMessage({ command: "chat", text })
				})

        document.getElementById('prompt').addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById('askBtn').click();
          }
        });

				window.addEventListener('message', event => {
					const { command, text } = event.data;
					if (command === 'chatResponse') {
						document.getElementById('response').innerText = text;
					}
				})
			</script>
		</body>
		</html>
	`;
    }
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand("victory-ext.helloWorld", () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage("Hello World from victory-ext!");
    });
    context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map