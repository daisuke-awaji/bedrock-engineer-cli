import chalk from "chalk";
import { writeToFile } from "./tools/tools";

export const LOG_FILE_NAME = "command.log.json";
const colorlize = {
  blue: chalk.blue,
  orange: chalk.hex("#FFA500"), // Orange color
  red: chalk.bold.red,
  green: chalk.green,
  black: chalk.black, // Black color
};
export const log = {
  ai: (str: string) => console.log(colorlize.blue(str)), // Blue color
  tool: (str: string) => console.log(colorlize.orange(str)), // Orange color
  you: (str: string) => console.log(colorlize.green(str)), // Green color
  info: (str: string) => console.log(colorlize.black(str)), // Black color
  warn: (str: string) => console.log(colorlize.red(str)), // Red color
  write: (obj: any) => {
    return writeToFile(LOG_FILE_NAME, JSON.stringify(obj, null, 2));
  },
};
