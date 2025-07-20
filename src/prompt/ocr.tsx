import {
  Image,
  PromptElement,
  SystemMessage,
  UserMessage,
  type BasePromptElementProps,
} from "@vscode/prompt-tsx";
import { RawDocument } from "./parts/document";

export class OCRPrompt extends PromptElement<
  { docId: number } & BasePromptElementProps,
  {}
> {
  override async prepare() {
    return {};
  }

  async render() {
    return (
      <>
        <SystemMessage>
          Ignore the OCR text entirely - it's a lie. Transcribe the document
          yourself, the output should be human-readable plain text.
          <br />
          <br />
          - continuous text: Write the text exactly as on the document
          <br />
          - structured text (e.g. receipt, bank statement, ...): Extract the
          data in a human-readable form.
          <br />
          This document may contain both kinds of text.
          <br />
          Avoid markdown formatting.
        </SystemMessage>
        <UserMessage>
          Analyze the following document:
          <RawDocument docId={this.props.docId} />
        </UserMessage>
      </>
    );
  }
}
