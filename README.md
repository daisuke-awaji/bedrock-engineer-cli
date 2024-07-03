# 🧙 Bedrock Engineer

Bedrock Engineer is an interactive command-line interface (CLI) to assist with software development tasks. This tool combines the capabilities of a large language model with practical file system operations and web search functionality.

This application is implemented in node.js based on the source code of super cool [Claude-Enginner](https://github.com/Doriandarko/claude-engineer), and supports various [Amazon Bedrock](https://aws.amazon.com/jp/bedrock/) models. It uses Bedrock's [Converse API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html).

## 💻 Demo



https://github.com/daisuke-awaji/bedrock-engineer/assets/20736455/b206ba1c-8f73-4021-90d3-f2ab6c5e1363



## ✨ Features

- 💬 Interactive chat interface with Bedrock-3.5-Sonnet
- 📁 File system operations (create folders, files, read/write files)
- 🔍 Web search capabilities using Tavily API
- 🏗️ Project structure creation and management
- 🧐 Code analysis and improvement suggestions
- 🚀 Automode for autonomous task completion
- 🔄 Iteration tracking in automode

TOBE implementation

- 🌈 Syntax highlighting for code snippets
- 🖼️ Vision capabilities support via drag and drop of images in the terminal

## 🛠️ Installation

1. Clone this repository:

   ```
   git clone https://github.com/daisuke-awaji/bedrock-engineer
   cd bedrock-engineer
   ```

2. Install the required dependencies:

   ```
   npm install
   ```

3. Set up your API keys:

   Add your Tavily API keys at the start of the .env file:

   ```.env
   TAVILY_API_KEY=tvly-xxxxxxxxxxxxx
   ```

## 🚀 Usage

Run the main script to start the Bedrock Engineer interface:

```
npm run start
```

## 🤖 Automode

Automode allows Bedrock to work autonomously on complex tasks. When in automode:

1. Bedrock sets clear, achievable goals based on your request.
2. It works through these goals one by one, using available tools as needed.
3. Bedrock provides regular updates on its progress.
4. Automode continues until goals are completed or the maximum number of iterations is reached.

To use automode:

1. Type 'automode' when prompted for input.
2. Provide your request when prompted.
3. Bedrock will work autonomously, providing updates after each iteration.
4. Automode exits when the task is completed or after reaching the maximum number of iterations.
