import {
  HTMLTracer,
  OutputMode,
  PromptRenderer,
  type ITokenizer,
} from "@vscode/prompt-tsx";
import { MainPrompt } from "./prompt/ocr.js";
import { encoding_for_model } from "tiktoken";
import { ChatCompletionContentPartKind } from "@vscode/prompt-tsx/dist/base/output/rawTypes";
import { getDocumentDownload } from "./paperless/document.js";

const encoding = encoding_for_model("gpt-4o");
console.log("Hello there from ts :)");

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

const tracer = new HTMLTracer();
const renderer = new PromptRenderer(
  {
    modelMaxPromptTokens: 1000000,
  },
  MainPrompt,
  {},
  tokenizer
);
renderer.tracer = tracer;
console.log(await renderer.render());

const html = tracer.serveHTML().then((server) => {
  console.log("Server address:", server.address);
});
await html;
