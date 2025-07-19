import {
  OutputMode,
  PromptRenderer,
  type ITokenizer,
} from "@vscode/prompt-tsx";
import { MainPrompt } from "./prompt/ocr.js";
import { encoding_for_model } from "tiktoken";
import { ChatCompletionContentPartKind } from "@vscode/prompt-tsx/dist/base/output/rawTypes";
import { gemini, gOpenai } from "./ai/google.js";
import type { ChatCompletionAssistantMessageParam } from "openai/resources.js";

const encoding = encoding_for_model("gpt-4o");
const tokenizer: ITokenizer<OutputMode.OpenAI> = {
  mode: OutputMode.OpenAI,
  tokenLength(part, token) {
    if (part.type === ChatCompletionContentPartKind.Text) {
      return 1 + encoding.encode(part.text).byteLength;
    }

    return Promise.resolve(0);
  },
  countMessageTokens(message) {
    if (typeof message.content == "string") {
      return 1 + encoding.encode(message.content).byteLength;
    }

    return 200;
  },
};

const renderer = new PromptRenderer(
  {
    modelMaxPromptTokens: 1000000,
  },
  MainPrompt,
  {},
  tokenizer
);
/*
const tracer: HTMLTracer | undefined = undefined as HTMLTracer | undefined; // new HTMLTracer();
renderer.tracer = tracer;
const html = tracer?.serveHTML().then((server) => {
  console.log("Server address:", server.address);
});
*/

const messages = await renderer.render();

console.log(messages.messages);

const res = await gOpenai.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: messages.messages as any,
});

console.log(res.choices[0].message.content);
