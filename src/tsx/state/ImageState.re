open CommonTypes;
open ImageTypes;

type imageState = {
  circles: HashMap.t(circle),
  lines: HashMap.t(line),
  lineSlots: HashMap.t(lineSlot),
  sentences: HashMap.t(sentence),
  words: HashMap.t(word),
  letters: HashMap.t(letter),
  text: array(uuid),
  svgSize: int,
};

let initialImageState: imageState = {
  circles: HashMap.empty,
  lines: HashMap.empty,
  lineSlots: HashMap.empty,
  sentences: HashMap.empty,
  words: HashMap.empty,
  letters: HashMap.empty,
  text: [||],
  svgSize: 1000,
};

type imageAction =
  | AddSentence(string);

let imageReducer = (state: imageState, action: imageAction) =>
  switch (action) {
  | AddSentence(sentence) => {
      ...state,
      text: Array.append(state.text, [|sentence|]),
    }
  };