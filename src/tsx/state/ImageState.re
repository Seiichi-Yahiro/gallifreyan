open ImageTypes;

type imageState = {
  circles: Relude.StringMap.t(circle),
  lines: Relude.StringMap.t(line),
  lineSlots: Relude.StringMap.t(lineSlot),
  circleItems: Relude.StringMap.t(circleItem),
  text: list(circleItem),
  svgSize: int,
};

let initialImageState: imageState = {
  circles: Relude.StringMap.make(),
  lines: Relude.StringMap.make(),
  lineSlots: Relude.StringMap.make(),
  circleItems: Relude.StringMap.make(),
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
      circleItem
      |> TextTransforms.flatMapCircleItemDeep(TextTransforms.createCircle)
      |> Relude.List.map((circle: circle) => (circle.id, circle))
      |> Relude.StringMap.fromList;

    {
      ...state,
      text: [circleItem, ...state.text],
      circles:
        state.circles
        |> Relude.StringMap.merge(
             (_, a, b) => Relude.Option.orElse(a, ~fallback=b),
             circles,
           ),
    };
  };