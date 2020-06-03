open CommonTypes;

type positionData = {
  angle: float,
  distance: float,
};

type line = {
  id: uuid,
  a: uuid,
  b: uuid,
};

type lineSlot = {
  id: uuid,
  pos: positionData,
  connection: option(uuid),
};

type circle = {
  id: uuid,
  pos: positionData,
  r: float,
  filled: bool,
};

type vocalPosType =
  | Inside
  | Outside
  | OnLine;

type vocalStyleType =
  | LineInside
  | LineOutside
  | NoStyle;

type consonantPosType =
  | DeepCut
  | ShallowCut
  | OnLine
  | Inside;

type consonantStyleType =
  | DoubleDot
  | TripleDot
  | SingleLine
  | DoubleLine
  | TripleLine
  | NoStyle;

type letterType =
  | Consonant(consonantPosType, consonantStyleType)
  | Vocal(vocalPosType, vocalStyleType);

type circleType =
  | Sentence
  | Word
  | Letter(letterType)
  | Dot;

type circleItem = {
  id: uuid,
  text: string,
  lineSlots: list(uuid),
  children: list(circleItem),
  type_: circleType,
};