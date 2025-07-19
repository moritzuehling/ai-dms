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

export async function llm<T extends BasePromptElementProps>(request: {
  ctor: PromptElementCtor<T, unknown>;
  props: T;
  children: null;
}) {
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
      response_format: {
        type: "text",
      },
    })
  ).choices[0];
}
