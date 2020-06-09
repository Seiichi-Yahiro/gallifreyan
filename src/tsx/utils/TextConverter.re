open CommonTypes;
open Uuid.V4;
open LetterGroups;

let rec groupDoubleLetters = (letters: list(string)): list(string) =>
  switch (letters) {
  | [] => []
  | [letter] => [letter]
  | [letter1, letter2, ...tail] =>
    switch (
      letter1->Tablecloth.String.toLower,
      letter2->Tablecloth.String.toLower,
    ) {
    | ("c", "h")
    | ("s", "h")
    | ("t", "h")
    | ("q", "u")
    | ("n", "g") => [letter1 ++ letter2, ...groupDoubleLetters(tail)]
    | _ => [letter1, ...groupDoubleLetters([letter2, ...tail])]
    }
  };

let rec groupWords = (letters: list(string)): list(list(string)) => {
  let trimmedLetters = letters->Tablecloth.List.dropWhile(~f=(===)(" "));
  switch (trimmedLetters) {
  | [] => []
  | _ =>
    let (word, remainder) =
      trimmedLetters->Tablecloth.List.splitWhen(~f=(===)(" "));
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

  Tablecloth.List.initialize(numberOfLines, _ => uuidv4());
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

  Tablecloth.List.initialize(numberOfDots, _ =>
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
  let letters = word->Tablecloth.List.map(~f=convertLetterToCircleItem);
  let word = word->Tablecloth.String.join(~sep="");

  {id: uuidv4(), text: word, lineSlots: [], children: letters, type_: Word};
};

let convertSentenceToTree = (sentence: string): list(list(string)) => {
  sentence
  ->Tablecloth.String.split(~on="")
  ->groupDoubleLetters
  ->groupWords
  ->Tablecloth.List.map(~f=Tablecloth.List.filter(~f=isValidLetter));
};

let convertSentenceToCircleItem = (sentence: string): ImageTypes.circleItem => {
  let tree = convertSentenceToTree(sentence);
  let words = tree->Tablecloth.List.map(~f=convertWordToCircleItem);
  let sentence =
    words
    ->Tablecloth.List.map(~f=word => word.text)
    ->Tablecloth.String.join(~sep=" ");

  {
    id: uuidv4(),
    text: sentence,
    lineSlots: [],
    children: words,
    type_: Sentence,
  };
};

let rec createCircles =
        (
          ~parentRadius: float,
          ~parentAngle: float,
          ~numberOfSiblings: int,
          index: int,
          circleItem: ImageTypes.circleItem,
        )
        : list(ImageTypes.circle) => {
  let type_ = circleItem.type_;
  let numberOfChildren = circleItem.children->Tablecloth.List.length;
  let r = CircleUtils.defaultRadius(type_);
  let distance =
    CircleUtils.defaultDistance(~type_, ~ownRadius=r, ~parentRadius);
  let angle =
    index->CircleUtils.defaultAngle(~type_, ~numberOfSiblings, ~parentAngle);
  let filled = CircleUtils.isFilled(type_);

  let children =
    circleItem.children
    ->Tablecloth.List.indexedMap(
        ~f=
          createCircles(
            ~parentRadius=r,
            ~parentAngle=angle,
            ~numberOfSiblings=numberOfChildren,
          ),
      )
    ->Tablecloth.List.concat;

  let self: ImageTypes.circle = {
    id: circleItem.id,
    r,
    filled,
    pos: {
      angle,
      distance,
    },
  };

  [self, ...children];
};

let rec createLineSlots =
        (
          ~circles: Tablecloth.StrDict.t(ImageTypes.circle),
          circleItem: ImageTypes.circleItem,
        )
        : list(ImageTypes.lineSlot) => {
  switch (circleItem.type_) {
  | Letter(
      Consonant(_, SingleLine | DoubleLine | TripleLine) as letterType |
      Vocal(_, LineInside | LineOutside) as letterType,
    ) =>
    let numberOfSiblings = circleItem.lineSlots->Tablecloth.List.length;

    let circle = circles->Tablecloth.StrDict.get(~key=circleItem.id);

    let parentAngle =
      circle
      ->Tablecloth.Option.map(~f=circle => circle.pos.angle)
      ->Tablecloth.Option.withDefault(~default=0.0);

    let pointOutside =
      switch (letterType) {
      | Vocal(_, LineOutside) => true
      | _ => false
      };

    let calculateAngle =
      CircleUtils.defaultLineSlotAngle(
        ~numberOfSiblings,
        ~parentAngle,
        ~pointOutside,
      );

    let radius =
      circle
      ->Tablecloth.Option.map(~f=circle => circle.r)
      ->Tablecloth.Option.withDefault(~default=0.0);

    circleItem.lineSlots
    ->Tablecloth.List.indexedMap(~f=(i, id) =>
        ImageTypes.{
          id,
          pos: {
            angle: calculateAngle(i),
            distance: radius,
          },
          connection: None,
        }
      );
  | _ =>
    circleItem.children
    ->Tablecloth.List.map(~f=createLineSlots(~circles))
    ->Tablecloth.List.concat
  };
};