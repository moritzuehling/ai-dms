import {
  AssistantMessage,
  Image,
  PromptElement,
  SystemMessage,
  UserMessage,
  type PromptSizing,
} from "@vscode/prompt-tsx";

export class MainPrompt extends PromptElement<{}, {}> {
  override async prepare() {
    return {};
  }

  async render() {
    return (
      <>
        <SystemMessage>
          Ignore the OCR text entirely, and transcribe the document - the output
          should be human-readable plain text. <br />
          The text should match exactly, but annotate the structure. Make sure
          all relevant information is extracted from the document.
        </SystemMessage>
        <UserMessage>
          <Image src="" detail="high" />
        </UserMessage>
      </>
    );
  }
}
