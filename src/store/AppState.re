module State = {
  type t = {
    image: ImageState.State.t,
    work: WorkState.State.t,
  };

  let initial: t = {
    image: ImageState.State.initial,
    work: WorkState.State.initial,
  };
};

module Action = {
  type t =
    | Image(ImageState.Action.t)
    | Work(WorkState.Action.t)
    | DevToolsCustom;
};

let reducer = (state: State.t, action: Action.t) =>
  switch (action) {
  | Image(imageAction) => {
      ...state,
      image: ImageState.reducer(state.image, imageAction),
    }
  | Work(workAction) => {
      ...state,
      work: WorkState.reducer(state.work, workAction),
    }
  | _ => state
  };