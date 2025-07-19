import {
  AssistantMessage,
  Image,
  PromptElement,
  SystemMessage,
  UserMessage,
  type PromptSizing,
} from "@vscode/prompt-tsx";
import { getDocumentDownload } from "../paperless/document";

export class MainPrompt extends PromptElement<{}, {}> {
  override async prepare() {
    return {};
  }

  async render() {
    // const doc = await getDocumentDownload(9);
    return (
      <>
        <SystemMessage>
          Ignore the OCR text entirely, and transcribe the document - the output
          should be human-readable plain text. <br />
          The text should match exactly, but annotate the structure. Make sure
          all relevant information is extracted from the document.
        </SystemMessage>
        <UserMessage>
          {/* <Image src={doc.uri!} detail="high" /> */}
        </UserMessage>
      </>
    );
  }
}
