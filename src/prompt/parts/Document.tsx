import { Image, PromptElement, UserMessage } from "@vscode/prompt-tsx";
import { getDoc, getDocumentDownload } from "../../paperless/document";
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
    return <UserMessage>{doc.content!}</UserMessage>;
  }
}
