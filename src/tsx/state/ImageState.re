open ImageTypes;

type imageState = {
  circles: Tablecloth.StrDict.t(circle),
  lines: Tablecloth.StrDict.t(line),
  lineSlots: Tablecloth.StrDict.t(lineSlot),
  circleItems: Tablecloth.StrDict.t(circleItem),
  text: list(circleItem),
  svgSize: int,
};

let initialImageState: imageState = {
  circles: Tablecloth.StrDict.empty,
  lines: Tablecloth.StrDict.empty,
  lineSlots: Tablecloth.StrDict.empty,
  circleItems: Tablecloth.StrDict.empty,
  text: [],
  svgSize: 1000,
};

type imageAction =
  | AddSentence(string);

let imageReducer = (state: imageState, action: imageAction) =>
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

    {
      ...state,
      text: [circleItem, ...state.text],
      circles:
        state.circles
        ->Tablecloth.StrDict.merge(
            ~f=(_, a, b) => Tablecloth.Option.orElse(a, b),
            circles,
          ),
    };
  };