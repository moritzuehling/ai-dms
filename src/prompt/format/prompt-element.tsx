import {
  PromptElement,
  type BasePromptElementProps,
  type PromptElementProps,
  type PromptPiece,
} from "@vscode/prompt-tsx";

export type BEP = BasePromptElementProps;

export abstract class Part<T> extends PromptElement<T & BEP> {}

export function makePE<T>(
  name: string,
  fn: (p: PromptElementProps<T>) => PromptPiece | Promise<PromptPiece>
) {
  class FNPart extends Part<T> {
    get insertLineBreakBefore() {
      return true;
    }

    render() {
      return fn(this.props);
    }
  }

  Object.defineProperties(FNPart, {
    name: {
      get: () => name,
    },
  });

  return FNPart;
}
