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
    | ImageAction(ImageState.Action.t)
    | WorkAction(WorkState.Action.t)
    | DevToolsCustomAction;
};

let appReducer = (state: State.t, action: Action.t) =>
  switch (action) {
  | ImageAction(imageAction) => {
      ...state,
      image: ImageState.reducer(state.image, imageAction),
    }
  | WorkAction(workAction) => {
      ...state,
      work: WorkState.reducer(state.work, workAction),
    }
  | _ => state
  };

let reductiveDevToolsEnhancer =
  ReductiveDevTools.Connectors.enhancer(
    ~options=
      ReductiveDevTools.Extension.enhancerOptions(
        ~name="Gallifreyan",
        ~actionCreators={
          "addSentence": (sentence: string) =>
            Action.ImageAction(AddSentence(sentence))
            ->ReductiveDevTools.Utilities.Serializer.serializeAction,
        },
        (),
      ),
    ~devToolsUpdateActionCreator=(_: State.t) => Action.DevToolsCustomAction,
    (),
  );

let enhancer = (store, next) => Logger.logger(store) @@ next;

let store =
  (reductiveDevToolsEnhancer @@ Reductive.Store.create)(
    ~reducer=appReducer,
    ~preloadedState=State.initial,
    ~enhancer,
    (),
  );

include ReductiveContext.Make({
  type action = Action.t;
  type state = State.t;
});