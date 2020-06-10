open CommonTypes;

module State = {
  type t = {
    selected: option(uuid),
    hovered: option(uuid),
  };

  let initial: t = {selected: None, hovered: None};
};

module Action = {
  type t =
    | Select(option(uuid))
    | Hover(option(uuid));
};

let reducer = (state: State.t, action: Action.t) =>
  switch (action) {
  | Select(newSelection) =>
    let isAlreadySelected =
      newSelection->Belt.Option.eq(state.selected, (===));
    {...state, selected: isAlreadySelected ? None : newSelection};
  | Hover(newHoverd) => {...state, hovered: newHoverd}
  };