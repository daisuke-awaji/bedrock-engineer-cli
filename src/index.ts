import { stdin as input, stdout as output, exit } from "node:process";
import * as readline from "node:readline/promises";
import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
} from "@aws-sdk/client-bedrock-runtime";
import { executTool, tools, writeToFile } from "./tools";
import systemPrompt from "./systemPrompt";
// import assert from "node:assert";
import dotenv from "dotenv";
dotenv.config();
// assert(process.env.TAVILY_API_KEY);

const client = new BedrockRuntimeClient({
  region: "us-east-1",
});

// const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";

const LOG_FILE_NAME = "command.log.json";

const inferenceConfig = {
  maxTokens: 4000,
  temperature: 0.5,
  topP: 0.9,
};

const conversationHistory: Message[] = [];

async function main() {
  console.log("Welcome to the Bedrock Enginner!");
  const rl = readline.createInterface({ input, output });

  try {
    while (true) {
      const userInput = await rl.question(`\nYou: `);

      if (userInput.toLowerCase() === "automode") {
        console.log("Okay, Start automode.");

        const userInput = await rl.question(`\nYou: `);
        console.log("Press Ctrl+C at any time to exit the automode loop.");
        await chatWithClaude(userInput);
        while (true) {
          await chatWithClaude("Continue with the next step.");
        }
      }

      await chatWithClaude(userInput);
    }
  } finally {
    rl.close();
  }
}

const chatWithClaude = async (userInput: string) => {
  const msg: Message = {
    role: "user",
    content: [{ text: userInput }],
  };
  conversationHistory.push(msg);

  const command = new ConverseCommand({
    modelId,
    messages: conversationHistory.filter((msg) => msg.content !== undefined),
    system: [{ text: systemPrompt() }],
    toolConfig: { tools },
    inferenceConfig,
  });
  // console.log(JSON.stringify(command, null, 2));
  await writeToFile(LOG_FILE_NAME, JSON.stringify(command, null, 2));
  const res = await client.send(command);
  // console.log(`Response: ${JSON.stringify({ response: res }, null, 4)}`);

  // assistant message
  let assistantResponse = "";
  for (const contentBlock of res.output?.message?.content ?? []) {
    if ("text" in contentBlock) {
      console.log(`Assistant: ${contentBlock?.text?.replace(/\\n/g, "\n")}`);
      assistantResponse += contentBlock?.text + "\n";
    } else if ("toolUse" in contentBlock) {
      const toolInput = contentBlock.toolUse?.input;
      const toolName = contentBlock.toolUse?.name;
      const toolUseId = contentBlock.toolUse?.toolUseId;

      console.log(`Tool Used: ${toolName}`);
      console.log(`Tool Input: ${JSON.stringify(toolInput, null, 4)}`);

      // execute tool
      const toolResult = await executTool(toolName, toolInput);
      console.log(`Tool Result: ${toolResult}`);

      conversationHistory.push({
        role: "assistant",
        content: [contentBlock],
      });
      conversationHistory.push({
        role: "user",
        content: [
          {
            toolResult: {
              toolUseId,
              content: [{ text: toolResult }],
              status: "success",
            },
          },
        ],
      });

      const messages = conversationHistory.filter(
        (msg) => msg.content !== undefined
      );
      // console.log(JSON.stringify(messages, null, 4));
      const command = new ConverseCommand({
        modelId,
        messages,
        system: [{ text: systemPrompt() }],
        toolConfig: { tools },
        inferenceConfig,
      });
      await writeToFile(LOG_FILE_NAME, JSON.stringify(command, null, 2));
      const toolResponse = await client.send(command);
      // console.log(`Tool Response: ${JSON.stringify(toolResponse, null, 4)}`);

      for (const contentBlock of toolResponse.output?.message?.content ?? []) {
        if ("text" in contentBlock) {
          assistantResponse += contentBlock?.text;
        }
      }
    }
  }

  conversationHistory.push({
    role: "assistant",
    content: [
      { text: assistantResponse === "" ? "complete" : assistantResponse },
    ],
  });
  console.log(`Assistant: ${assistantResponse.replace(/\\n/g, "\n")}`);

  // console.log(
  //   `Conversation History: ${JSON.stringify(conversationHistory, null, 4)}`
  // );
};

main();
