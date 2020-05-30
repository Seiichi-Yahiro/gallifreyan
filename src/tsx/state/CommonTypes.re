type uuid = string;

module HashMap =
  Map.Make({
    type t = uuid;
    let compare = compare;
  });

let findSafe = (key, m) =>
  switch (HashMap.find(key, m)) {
  | item => Some(item)
  | exception _ => None
  };