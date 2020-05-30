open CommonTypes;

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
  id: uuid,
  text: string,
  lineSlots: array(uuid),
};

type consonant = {
  id: uuid,
  text: string,
  lineSlots: array(uuid),
  dots: array(uuid),
  vocal: option(uuid),
};

type letter =
  | Consonant(consonant)
  | Vocal(vocal);

type word = {
  id: uuid,
  text: string,
  lineSlots: array(uuid),
  letters: array(uuid),
};

type sentence = {
  id: uuid,
  text: string,
  lineSlots: array(uuid),
  words: array(uuid),
};