open ImageTypes;

module State = {
  type t = {
    circles: Tablecloth.StrDict.t(circle),
    lines: Tablecloth.StrDict.t(line),
    lineSlots: Tablecloth.StrDict.t(lineSlot),
    circleItems: Tablecloth.StrDict.t(circleItem),
    text: list(circleItem),
    svgSize: int,
  };

  let initial: t = {
    circles: Tablecloth.StrDict.empty,
    lines: Tablecloth.StrDict.empty,
    lineSlots: Tablecloth.StrDict.empty,
    circleItems: Tablecloth.StrDict.empty,
    text: [],
    svgSize: 1000,
  };
};

module Action = {
  type t =
    | AddSentence(string);
};

let reducer = (state: State.t, action: Action.t) =>
  switch (action) {
  | AddSentence(sentence) =>
    let circleItem = TextConverter.convertSentenceToCircleItem(sentence);
    let circles =
      TextConverter.createCircles(
        ~parentRadius=0.0,
        ~parentAngle=0.0,
        ~numberOfSiblings=1,
        0,
        circleItem,
      )
      ->Tablecloth.List.map(~f=circle => (circle.id, circle))
      ->Tablecloth.StrDict.fromList;

    let lineSlots =
      circleItem
      ->TextConverter.createLineSlots(~circles)
      ->Tablecloth.List.map(~f=slot => (slot.id, slot))
      ->Tablecloth.StrDict.fromList;

    {
      ...state,
      text: [circleItem, ...state.text],
      circles:
        state.circles
        ->Tablecloth.StrDict.merge(
            ~f=(_, a, b) => Tablecloth.Option.orElse(a, b),
            circles,
          ),
      lineSlots:
        state.lineSlots
        ->Tablecloth.StrDict.merge(
            ~f=(_, a, b) => Tablecloth.Option.orElse(a, b),
            lineSlots,
          ),
    };
  };