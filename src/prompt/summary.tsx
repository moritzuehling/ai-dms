import { Image, SystemMessage, UserMessage } from "@vscode/prompt-tsx";
import { getDocumentDownload } from "../paperless/document";
import { Part, type BEP } from "./format/prompt-element";
import { $, $1, List } from "./format/elements";
import { DocumentContent } from "./parts/Document";

export class SummarizeDoc extends Part<{ docId: number }> {
  override async prepare() {}

  async render() {
    const doc = await getDocumentDownload(this.props.docId);
    return (
      <>
        <SystemMessage>
          Let's extract some key info from this document. Extract the
          information, answer in plain text.
          <br />
          <List ordered>
            {$} Summary:
            {$1} Two-sentence summary, e.g. "Document showing X"
            {$} Parties:
            {$1} The involved parties in this document. Mark at least one as
            "Author", and if applicable, one as "Recipient"
            {$} Dates:
            {$1} A list of dates mentioned in the document, with name. For
            example, add "Appointment Date", "Invoice Date", "Reminder Date"
            {$} IDs:
            {$1} Get a list of all *relevant* identifiers in the doucment.
            Customer IDs, Tax IDs, ...
            {$} Contact Infromation:
            {$1} A list of contact information in the document, e.g. email /
            phone numbers - esp. of companies
            {$} Bank Information (if applicable):
            {$1} Esp. IBAN / BIC if applicable.
            {$} Additional Key Points:
            {$1} Relevant key information from the document for the recipient -
            what's the thing a normal person would care about?
          </List>
        </SystemMessage>
        <UserMessage>
          <DocumentContent docId={this.props.docId} />
        </UserMessage>
      </>
    );
  }
}
