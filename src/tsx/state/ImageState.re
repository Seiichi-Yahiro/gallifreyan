open ImageTypes;

type imageState = {
  circles: Belt.Map.String.t(circle),
  lines: Belt.Map.String.t(line),
  lineSlots: Belt.Map.String.t(lineSlot),
  circleItems: Belt.Map.String.t(circleItem),
  text: list(circleItem),
  svgSize: int,
};

let initialImageState: imageState = {
  circles: Belt.Map.String.empty,
  lines: Belt.Map.String.empty,
  lineSlots: Belt.Map.String.empty,
  circleItems: Belt.Map.String.empty,
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
      TextTransforms.convertCircleItemToCircleRecursive(circleItem)
      ->Belt.List.map(circle => (circle.id, circle))
      ->Belt.List.toArray
      ->Belt.Map.String.fromArray;

    {
      ...state,
      text: [circleItem, ...state.text],
      circles:
        state.circles
        ->Belt.Map.String.merge(circles, (_, a, b) =>
            Utils.Option.xor(a, b)
          ),
    };
  };