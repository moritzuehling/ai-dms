import { UserMessage } from "@vscode/prompt-tsx";
import { Part } from "./format/prompt-element";

export class ClassifyDoc extends Part<{ docId: number }> {
  async render() {
    return <UserMessage>This was a triumph :)</UserMessage>;
  }
}
