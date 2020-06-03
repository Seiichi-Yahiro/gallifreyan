open CommonTypes;
open Uuid.V4;
open LetterGroups;

let rec groupDoubleLetters = (letters: list(string)): list(string) =>
  switch (letters) {
  | [] => []
  | [letter] => [letter]
  | [letter1, letter2, ...rest] =>
    switch (letter1->String.lowercase_ascii, letter2->String.lowercase_ascii) {
    | ("c", "h")
    | ("s", "h")
    | ("t", "h")
    | ("q", "u")
    | ("n", "g") => [letter1 ++ letter2, ...groupDoubleLetters(rest)]
    | _ => [letter1, ...groupDoubleLetters([letter2, ...rest])]
    }
  };

let rec groupWords = (letters: list(string)): list(list(string)) => {
  let trimmedLetters = letters->Utils.List.dropWhile(Utils.Bool.eq(" "));
  switch (trimmedLetters) {
  | [] => []
  | _ =>
    let (word, remainder) =
      trimmedLetters->Utils.List.span(Utils.Bool.neq(" "));
    [word, ...groupWords(remainder)];
  };
};

let createLineSlotIds = (letterType: ImageTypes.letterType): list(uuid) => {
  let numberOfLines =
    switch (letterType) {
    | Vocal(_, style) =>
      switch (style) {
      | LineInside
      | LineOutside => 1
      | NoStyle => 0
      }
    | Consonant(_, style) =>
      switch (style) {
      | SingleLine => 1
      | DoubleLine => 2
      | TripleLine => 3
      | _ => 0
      }
    };

  Belt.List.makeBy(numberOfLines, _ => uuidv4());
};

let createDots =
    (letterType: ImageTypes.letterType): list(ImageTypes.circleItem) => {
  let numberOfDots =
    switch (letterType) {
    | Consonant(_, style) =>
      switch (style) {
      | DoubleDot => 2
      | TripleDot => 3
      | _ => 0
      }
    | _ => 0
    };

  Belt.List.makeBy(numberOfDots, _ =>
    ImageTypes.{
      id: uuidv4(),
      text: "DOT",
      lineSlots: [],
      children: [],
      type_: Dot,
    }
  );
};

let convertLetterToLetterType = (letter: string): ImageTypes.letterType =>
  isVocal(letter)
    ? Vocal(
        LetterGroups.Vocal.toPosType(letter),
        LetterGroups.Vocal.toStyleType(letter),
      )
    : Consonant(
        LetterGroups.Consonant.toPosType(letter),
        LetterGroups.Consonant.toStyleType(letter),
      );

let convertLetterToCircleItem = (letter: string): ImageTypes.circleItem => {
  let letterType = convertLetterToLetterType(letter);

  let lineSlots = createLineSlotIds(letterType);
  let dots = createDots(letterType);

  {
    id: uuidv4(),
    text: letter,
    lineSlots,
    children: dots,
    type_: Letter(letterType),
  };
};

let convertWordToCircleItem = (word: list(string)): ImageTypes.circleItem => {
  let letters = word->Belt.List.map(convertLetterToCircleItem);
  let word = word->Belt.List.reduce("", (++));

  {id: uuidv4(), text: word, lineSlots: [], children: letters, type_: Word};
};

let convertSentenceToTree = (sentence: string): list(list(string)) => {
  Utils.List.fromString(sentence)
  ->groupDoubleLetters
  ->groupWords
  ->Belt.List.map(Belt.List.keep(_, isValidLetter));
};

let convertSentenceToCircleItem = (sentence: string): ImageTypes.circleItem => {
  let tree = convertSentenceToTree(sentence);
  let words = tree->Belt.List.map(convertWordToCircleItem);
  let sentence =
    words
    ->Belt.List.reduce("", (acc, circleItem) => acc ++ " " ++ circleItem.text)
    ->String.trim;

  {
    id: uuidv4(),
    text: sentence,
    lineSlots: [],

    children: words,
    type_: Sentence,
  };
};