open CommonTypes;
open ImageTypes;

type imageState = {
  circles: HashMap.t(circle),
  lines: HashMap.t(line),
  lineSlots: HashMap.t(lineSlot),
  circleItems: HashMap.t(circleItem),
  text: array(circleItem),
  svgSize: int,
};

let initialImageState: imageState = {
  circles: HashMap.empty,
  lines: HashMap.empty,
  lineSlots: HashMap.empty,
  circleItems: HashMap.empty,
  text: [||],
  svgSize: 1000,
};

type imageAction =
  | AddSentence(string);

let imageReducer = (state: imageState, action: imageAction) =>
  switch (action) {
  | AddSentence(sentence) => {
      ...state,
      text: {
        let circleItem = TextConverter.convertSentenceToCircleItem(sentence);
        Belt.Array.concat(state.text, [|circleItem|]);
      },
    }
  };