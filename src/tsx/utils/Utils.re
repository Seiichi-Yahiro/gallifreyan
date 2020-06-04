module List = {
  let rec takeWhile = (items: list('a), predicate: 'a => bool): list('a) =>
    switch (items) {
    | [] => []
    | [item, ...tail] =>
      predicate(item) ? [item, ...takeWhile(tail, predicate)] : []
    };

  let rec dropWhile = (items: list('a), predicate: 'a => bool): list('a) =>
    switch (items) {
    | [] => []
    | [item, ...tail] =>
      predicate(item) ? dropWhile(tail, predicate) : [item, ...tail]
    };

  let rec span =
          (items: list('a), predicate: 'a => bool): (list('a), list('a)) =>
    switch (items) {
    | [] => ([], [])
    | [item, ...tail] =>
      if (predicate(item)) {
        let (matching, remaining) = span(tail, predicate);
        ([item, ...matching], remaining);
      } else {
        ([], tail);
      }
    };

  let fromString = (str: string): list(string) =>
    String.length(str)->Belt.List.makeBy(Js.String2.get(str));

  let rec join = (list: list(string), delimiter: string): string => {
    switch (list) {
    | [] => ""
    | [tail] => tail
    | [head, ...tail] => head ++ delimiter ++ join(tail, delimiter)
    };
  };
};

module Option = {
  let xor = (a, b) =>
    switch (a->Belt.Option.isSome, b->Belt.Option.isSome) {
    | (true, false) => a
    | (false, true) => b
    | _ => None
    };
};