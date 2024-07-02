import * as fs from "fs/promises";
import * as path from "path";
import { Tool, ToolSpecification } from "@aws-sdk/client-bedrock-runtime";

const CLAUDE_COLOR = "\x1b[36m";
const Style = {
  RESET_ALL: "\x1b[0m",
};

export function printColored(text: string, color: string): void {
  console.log(`${color}${text}${Style.RESET_ALL}`);
}

export async function createFolder(folderPath: string): Promise<string> {
  try {
    await fs.mkdir(folderPath, { recursive: true });
    return `Folder created: ${folderPath}`;
  } catch (e: any) {
    return `Error creating folder: ${e.message}`;
  }
}

export async function createFile(
  filePath: string,
  content: string
): Promise<string> {
  try {
    await fs.writeFile(filePath, content);
    return `File created: ${filePath}`;
  } catch (e: any) {
    return `Error creating file: ${e.message}`;
  }
}

export async function writeToFile(
  filePath: string,
  content: string
): Promise<string> {
  try {
    await fs.writeFile(filePath, content);
    return `Content written to file: ${filePath}`;
  } catch (e: any) {
    return `Error writing to file: ${e.message}`;
  }
}

export async function readFile(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (e: any) {
    return `Error reading file: ${e.message}`;
  }
}

export async function listFiles(dirPath = "."): Promise<string> {
  try {
    const files = await fs.readdir(dirPath);
    return files.join("\n");
  } catch (e: any) {
    return `Error listing files: ${e.message}`;
  }
}

export const tools: Tool[] = [
  {
    toolSpec: {
      name: "createFolder",
      description:
        "Create a new folder at the specified path. Use this when you need to create a new directory in the project structure.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The path where the folder should be created",
            },
          },
          required: ["path"],
        },
      },
    },
  },
  {
    toolSpec: {
      name: "createFile",
      description:
        "Create a new file at the specified path with optional content. Use this when you need to create a new file in the project structure.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The path where the file should be created",
            },
            content: {
              type: "string",
              description: "The initial content of the file (optional)",
            },
          },
          required: ["path"],
        },
      },
    },
  },
  {
    toolSpec: {
      name: "writeToFile",
      description:
        "Write content to an existing file at the specified path. Use this when you need to add or update content in an existing file.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The path of the file to write to",
            },
            content: {
              type: "string",
              description: "The content to write to the file",
            },
          },
          required: ["path", "content"],
        },
      },
    },
  },
  {
    toolSpec: {
      name: "readFile",
      description:
        "Read the contents of a file at the specified path. Use this when you need to examine the contents of an existing file.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The path of the file to read",
            },
          },
          required: ["path"],
        },
      },
    },
  },
  {
    toolSpec: {
      name: "listFiles",
      description:
        "List all files and directories in the root folder where the script is running. Use this when you need to see the contents of the current directory.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description:
                "The path of the folder to list (default: current directory)",
            },
          },
        },
      },
    },
  },
  //   {
  //     name: "tavilySearch",
  //     description:
  //       "Perform a web search using Tavily API to get up-to-date information or additional context. Use this when you need current information or feel a search could provide a better answer.",
  //     inputSchema: {
  //       type: "object",
  //       properties: {
  //         query: {
  //           type: "string",
  //           description: "The search query",
  //         },
  //       },
  //       required: ["query"],
  //     },
  //   },
];

export const executTool = (toolName: string | undefined, toolInput: any) => {
  switch (toolName) {
    case "createFolder":
      return createFolder(toolInput["path"]);
    case "createFile":
      return createFile(toolInput["path"], toolInput["content"]);
    case "writeToFile":
      return writeToFile(toolInput["path"], toolInput["content"]);
    case "readFile":
      return readFile(toolInput["path"]);
    case "listFiles":
      return listFiles(toolInput["path"]);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
};
