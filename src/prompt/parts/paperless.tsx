import {
  AssistantMessage,
  ToolMessage,
  type PromptPiece,
  type PromptSizing,
} from "@vscode/prompt-tsx";
import { Part } from "../format/prompt-element";
import { $, $1, List } from "../format/elements";
import { api } from "../../paperless/api";
import type { ChatResponsePart } from "@vscode/prompt-tsx/dist/base/vscodeTypes";
import type { Progress, CancellationToken } from "vscode";

export class AvailableTagsFakeTool extends Part<{}> {
  render() {
    return (
      <FakeToolcall name="get_tags">
        <List>
          {$} AGB / TOS
          {$1} Apply to all documents that have a non-individualized contract.
          {$} Banking
          {$1} Documents sent by any bank.
          {$} Contract
          {$1} Documents that are an individualized / negotatiated contract.
          {$} Contract Information
          {$1} Everything about a contractual relationship but the contract
          itself.
          {$} Datawisp
          {$1} Everything about the company Datawisp, Inc.
          {$} Healthcare
          {$1} Everything related to healthcare. Letters by insurances, doctor
          invoices, diagnosis docs, ...
          {$} Insurance
          {$1} Everything relating to insurances. Also applies to health
          insurance.
          {$} Health Insurance
          {$1} All documents directly relating to health insurance (be strict
          about this.)
          {$} Payment Reminder / Mahnung
          {$1} All documents that are an invoice for sth late or similar
          {$} Social Security
          {$1} Health insurance, retirement insurance, unemployment insurance.
          Note: Documents need to primarily focus on this to get the tag.
          {$} StatsHelix
          {$1} Everything about the company StatsHelix, Inc.
          {$} Scholarship
          {$1} Everything directly relating to a specific scholarship.
          {$} Studium
          {$1} Everything directly relating to university.
          {$} Taxes
          {$1} Everything directly relating to taxes. Be strict about this.
          {$} Travel
          {$1} Travel expenses, hotel bookings, visa correspondence, etc. Fairly
          strict.
          {$} Utilities
          {$1} Utility bills, updates, ....
        </List>
      </FakeToolcall>
    );
  }
}

export class AvailableCorrespondents extends Part<{}> {
  async render() {
    const res = await api.GET("/api/correspondents/");

    const data = res.data!.results.map((a) => ({
      id: a.id,
      name: a.name,
    }));

    return (
      <FakeToolcall name="get_documentTypes">
        {JSON.stringify(data, undefined, 2)}
      </FakeToolcall>
    );
  }
}

export class DocumentTypes extends Part<{}> {
  async render() {
    const res = await api.GET("/api/document_types/");

    const data = res.data!.results.map((a) => ({
      id: a.id,
      name: a.name,
    }));

    return (
      <FakeToolcall name="get_document_types">
        {JSON.stringify(data, undefined, 2)}
      </FakeToolcall>
    );
  }
}

class FakeToolcall extends Part<{ name: string; args?: object }> {
  render() {
    const id = Math.random().toString().substring(2);
    return (
      <>
        <AssistantMessage
          toolCalls={[
            {
              type: "function",
              id: this.props.name + "_" + id,
              function: {
                name: this.props.name,
                arguments: JSON.stringify(this.props.args ?? {}),
              },
            },
          ]}
        />

        <ToolMessage toolCallId={this.props.name + "_" + id}>
          {this.props.children}
        </ToolMessage>
      </>
    );
  }
}
