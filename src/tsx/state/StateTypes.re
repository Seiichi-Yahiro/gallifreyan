type uuid = string;

type positionData = {
  angle: float,
  distance: float,
};

type line = {
  a: uuid,
  b: uuid,
};

type lineSlot = {
  pos: positionData,
  connection: option(uuid),
};

type circle = {
  pos: positionData,
  r: float,
  filled: bool,
};

type vocal = {
  text: string,
  circle: uuid,
  lineSlots: array(uuid),
};

type consonant = {
  text: string,
  circle,
  lineSlots: array(uuid),
  dots: array(uuid),
  vocal: option(vocal),
};

type letter =
  | Consonant(consonant)
  | Vocal(vocal);

type word = {
  text: string,
  circle: uuid,
  lineSlots: array(uuid),
  letters: array(letter),
};

type sentence = {
  text: string,
  circle: uuid,
  lineSlots: array(uuid),
  words: array(word),
};

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

type appState = {
  circles: HashMap.t(circle),
  sentences: array(sentence),
};