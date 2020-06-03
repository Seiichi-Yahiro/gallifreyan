let (>>) = (a: 'a => 'b, b: 'b => 'c): ('a => 'c) => {
  let helper = vl => vl->a->b;
  helper;
};

module List = {
  let rec takeWhile = (items: list('a), predicate: 'a => bool): list('a) =>
    switch (items) {
    | [] => []
    | [item, ...rest] =>
      predicate(item) ? [item, ...takeWhile(rest, predicate)] : []
    };

  let rec dropWhile = (items: list('a), predicate: 'a => bool): list('a) =>
    switch (items) {
    | [] => []
    | [item, ...rest] =>
      predicate(item) ? dropWhile(rest, predicate) : [item, ...rest]
    };

  let rec span =
          (items: list('a), predicate: 'a => bool): (list('a), list('a)) =>
    switch (items) {
    | [] => ([], [])
    | [item, ...rest] =>
      if (predicate(item)) {
        let (matching, remaining) = span(rest, predicate);
        ([item, ...matching], remaining);
      } else {
        ([], rest);
      }
    };

  let fromString = (str: string): list(string) =>
    String.length(str)->Belt.List.makeBy(Js.String2.get(str));
};

module Bool = {
  let eq = (left: 'a, right: 'a): bool => left === right;
  let neq = (left: 'a, right: 'a): bool => !eq(left, right);
};

module Option = {
  let xor = (a, b) =>
    switch (a->Belt.Option.isSome, b->Belt.Option.isSome) {
    | (true, false) => a
    | (false, true) => b
    | _ => None
    };
};