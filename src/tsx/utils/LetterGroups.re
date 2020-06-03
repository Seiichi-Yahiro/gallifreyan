module Consonant = {
  let deepCut = [%re "/^(?:b|ch|d|g|h|f)$/i"];
  let inside = [%re "/^[jklnpm]$/i"];
  let shallowCut = [%re "/^(?:t|sh|r|v|w|s)$/i"];
  let onLine = [%re "/^(?:th|y|z|qu|x|ng)$/i"];

  let doubleDot = [%re "/^(?:ch|k|sh|y)$/i"];
  let tripleDot = [%re "/^[dlrz]$/i"];

  let singleLine = [%re "/^(?:g|n|v|qu)$/i"];
  let doubleLine = [%re "/^[hpwx]$/i"];
  let tripleLine = [%re "/^(?:f|m|s|ng)$/i"];

  let doubleLetter = [%re "/ch|sh|th|qu|ng/i"];

  let toPosType = (text: string): ImageTypes.consonantPosType => {
    let test = Js.Re.test_(_, text);
    if (test(deepCut)) {
      DeepCut;
    } else if (test(shallowCut)) {
      ShallowCut;
    } else if (test(inside)) {
      Inside;
    } else if (test(onLine)) {
      OnLine;
    } else {
      Js.Exn.raiseEvalError(
        {j|Cannot determine ConsonantPosType for $text!|j},
      );
    };
  };

  let toStyleType = (text: string): ImageTypes.consonantStyleType => {
    let test = Js.Re.test_(_, text);

    if (test(doubleDot)) {
      DoubleDot;
    } else if (test(tripleDot)) {
      TripleDot;
    } else if (test(singleLine)) {
      SingleLine;
    } else if (test(doubleLine)) {
      DoubleLine;
    } else if (test(tripleLine)) {
      TripleLine;
    } else {
      NoStyle;
    };
  };
};

module Vocal = {
  let vocal = [%re "/^[aeiou]$/i"];

  let onLine = [%re "/^[eiu]$/i"];
  let outside = [%re "/^a$/i"];
  let inside = [%re "/^o$/i"];

  let singleLine = [%re "/^[iu]$/i"];
  let lineInside = [%re "/^i$/i"];
  let lineOutside = [%re "/^u$/i"];

  let toPosType = (text: string): ImageTypes.vocalPosType => {
    let test = Js.Re.test_(_, text);
    if (test(inside)) {
      Inside;
    } else if (test(outside)) {
      Outside;
    } else if (test(onLine)) {
      OnLine;
    } else {
      Js.Exn.raiseEvalError({j|Cannot determine VocalPosType for $text!|j});
    };
  };

  let toStyleType = (text: string): ImageTypes.vocalStyleType => {
    let test = Js.Re.test_(_, text);
    if (test(lineInside)) {
      LineInside;
    } else if (test(lineOutside)) {
      LineOutside;
    } else {
      NoStyle;
    };
  };
};

let isConsonant = (text: string): bool =>
  [
    Consonant.deepCut,
    Consonant.shallowCut,
    Consonant.inside,
    Consonant.onLine,
    Consonant.doubleLetter,
  ]
  ->Belt.List.some(Js.Re.test_(_, text));

let isVocal = Js.Re.test_(Vocal.vocal, _);

let isValidLetter = (text: string): bool =>
  [isVocal, isConsonant]->Belt.List.some(predicate => predicate(text));