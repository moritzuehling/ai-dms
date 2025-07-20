import {
  AssistantMessage,
  SystemMessage,
  ToolMessage,
  UserMessage,
} from "@vscode/prompt-tsx";
import { Part } from "./format/prompt-element";
import { $, $1, List } from "./format/elements";
import { DocumentSummary, RawDocument } from "./parts/document";
import {
  AvailableCorrespondents,
  AvailableTagsFakeTool,
  DocumentTypes,
} from "./parts/paperless";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

export const classifySchema = z.object({
  title: z
    .string()
    .describe(
      "Title of the document. Use the document's language. If the document has a title, add it. Keep it brief, 3-10 words."
    ),
  docType: z.number().describe("See answer of get_documentTypes"),
  correspondent: z
    .number()
    .describe("Use existing correspondent with a given ID")
    .or(
      z
        .string()
        .describe(
          "Create new correspondent. Try to avoid this, unless necessary."
        )
    ),
  oneLiner: z
    .string()
    .describe(
      "example: 'Aspirin receipt by Dr. Fakename', 'Electricity Bill November 2024 - Third payment reminder.', 'Bank Card PIN Letter for DKB Credit Card, Nov 2023'"
    ),
  documentDate: z
    .string()
    .describe(
      "The date that most closely describes this document (for a letter, the day of writing. Contract, day of signing, ...)"
    ),
});

export class ClassifyDoc extends Part<{ docId: number }> {
  async render() {
    return (
      <>
        <SystemMessage>
          Let's analyze this document for use in a personal Document Management
          System.
          <br />
          We need to give it a title find the correspondent, give it tags, and
          fill out some custom fields.
          <br />
          Look into the origina document if needed.
          <br />
          For this, you have function calls available. First, let's figure out
          what data is available: M
        </SystemMessage>
        <AvailableTagsFakeTool />
        <AvailableCorrespondents />
        <DocumentTypes />
        <UserMessage>
          <RawDocument docId={this.props.docId} />
          <DocumentSummary docId={this.props.docId} />
        </UserMessage>
        <SystemMessage>
          Expected Response Schema:
          <br />
          {JSON.stringify(
            zodResponseFormat(classifySchema, "whatever").json_schema.schema,
            undefined,
            2
          )}
        </SystemMessage>
      </>
    );
  }
}
