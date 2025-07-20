import {
  AssistantMessage,
  SystemMessage,
  ToolMessage,
} from "@vscode/prompt-tsx";
import { Part } from "./format/prompt-element";
import { $, $1, List } from "./format/elements";
import { DocumentSummary } from "./parts/document";
import {
  AvailableCorrespondents,
  AvailableTagsFakeTool,
  DocumentTypes,
} from "./parts/paperless";

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
          For this, you have function calls available. First, let's figure out
          what data is available:
        </SystemMessage>
        <AvailableTagsFakeTool />
        <AvailableCorrespondents />
        <DocumentTypes />
        <SystemMessage>
          Respond with:
          {JSON.stringify(
            {
              docTitle: "<brief, 3-8 words - super specific>",
              docType: 0,
              correspondentId: 0,
              oneLiner:
                "example: 'Aspirin receipt by Dr. Fakename', 'Electricity Bill November 2024 - Third payment reminder.', 'Bank Card PIN Letter for DKB Credit Card, Nov 2023'",
              tags: ["a", "b"],
            },
            undefined,
            2
          )}
        </SystemMessage>
        <DocumentSummary docId={this.props.docId} />
      </>
    );
  }
}
