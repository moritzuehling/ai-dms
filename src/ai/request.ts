import { encoding_for_model } from "tiktoken";
import { ChatCompletionContentPartKind } from "@vscode/prompt-tsx/dist/base/output/rawTypes";
import {
  OutputMode,
  PromptRenderer,
  type BasePromptElementProps,
  type ITokenizer,
  type PromptElementCtor,
} from "@vscode/prompt-tsx";
import { gOpenai } from "./google";
import type { ChatCompletionCreateParams } from "openai/resources/index.mjs";

const encoding = encoding_for_model("gpt-4o");
export async function llm<T extends BasePromptElementProps>(
  request: {
    ctor: PromptElementCtor<T, unknown>;
    props: T;
    children: null;
  },
  respnseFormat?: ChatCompletionCreateParams["response_format"]
) {
  const tokenizer: ITokenizer<OutputMode.OpenAI> = {
    mode: OutputMode.OpenAI,
    tokenLength(part, token) {
      if (part.type === ChatCompletionContentPartKind.Text) {
        return 1 + part.text.length / 10; // encoding.encode(part.text).byteLength;
      }

      return Promise.resolve(0);
    },
    countMessageTokens(message) {
      if (typeof message.content == "string") {
        return 1 + message.content.length / 10; // encoding.encode(message.content).byteLength;
      }

      return 200;
    },
  };

  const renderer = new PromptRenderer(
    {
      modelMaxPromptTokens: 1000000,
    },
    request.ctor,
    request.props,
    tokenizer
  );
  const messages = await renderer.render();

  return (
    await gOpenai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: messages.messages as any,
      reasoning_effort: "low",
      response_format: respnseFormat ?? {
        type: "text",
      },
    })
  ).choices[0];
}
