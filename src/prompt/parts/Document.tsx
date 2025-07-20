import { Image, PromptElement, UserMessage } from "@vscode/prompt-tsx";
import {
  getDoc,
  getDocumentDownload,
  parseDocContent,
} from "../../paperless/document";
import { Part, type BEP } from "../format/prompt-element";

export class RawDocument extends Part<{ docId: number }> {
  async render() {
    const doc = await getDocumentDownload(this.props.docId);
    return (
      <>
        <Image src={doc.uri!} detail="high" />
      </>
    );
  }
}

export class DocumentContent extends Part<{ docId: number }> {
  async render() {
    const doc = await (await getDoc(this.props.docId)).data!;
    const { content } = parseDocContent(doc);
    return <UserMessage>{content!}</UserMessage>;
  }
}

export class DocumentSummary extends Part<{ docId: number }> {
  async render() {
    const doc = await (await getDoc(this.props.docId)).data!;
    const { summary, content } = parseDocContent(doc);

    if (!summary && !content) {
      throw new Error("Cannot parse empty document.");
    }

    if (!summary) {
      console.warn("Document", this.props.docId, "does not have a summary!");
    }

    return <>{summary ?? content}</>;
  }
}
