import { makePE } from "./prompt-element";

export const List = makePE<{ ordered?: boolean }>("List", (p) => {
  let order = 0;
  return (
    <>
      <br />
      {p.children?.map((a, i) => {
        if (a == $1) {
          return !p.ordered ? (
            a
          ) : (
            <>
              <br />
              {"  "}
            </>
          );
        }

        if (a != $) {
          return a;
        }

        const prefix = p.ordered ? `${++order}.` : `-`;
        if (order == 1) {
          return prefix;
        } else {
          return (
            <>
              <br />
              {prefix}
            </>
          );
        }
      })}
      <br />
    </>
  );
});

export const $ = (
  <>
    <br />-
  </>
);

export const $1 = (
  <>
    <br />{" "}
  </>
);
