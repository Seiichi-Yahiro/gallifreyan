module List = {
  /**
    Splits a list at the first item where the predicate is false.
    This is basically (takeWhile(predicate, list), dropWhile(predicate, list)).
  */
  let rec span =
          (predicate: 'a => bool, items: list('a)): (list('a), list('a)) =>
    switch (items) {
    | [] => ([], [])
    | [item, ...tail] =>
      if (predicate(item)) {
        let (matching, remaining) = span(predicate, tail);
        ([item, ...matching], remaining);
      } else {
        ([], tail);
      }
    };

  let rec join = (delimiter: string, list: list(string)): string => {
    switch (list) {
    | [] => ""
    | [tail] => tail
    | [head, ...tail] => head ++ delimiter ++ join(delimiter, tail)
    };
  };
};