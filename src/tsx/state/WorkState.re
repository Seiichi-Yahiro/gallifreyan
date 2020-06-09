open CommonTypes;

type state = {
  selected: option(uuid),
  hovered: option(uuid),
};

let initialState: state = {selected: None, hovered: None};

type action =
  | Select(option(uuid))
  | Hover(option(uuid));

let reducer = (state: state, action: action) =>
  switch (action) {
  | Select(item) => {...state, selected: item}
  | Hover(item) => {...state, hovered: item}
  };