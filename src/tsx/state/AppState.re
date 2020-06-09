type appState = {
  image: ImageState.state,
  work: WorkState.state,
};

let initialAppState: appState = {
  image: ImageState.initialState,
  work: WorkState.initialState,
};

type appAction =
  | ImageAction(ImageState.action)
  | WorkAction(WorkState.action)
  | DevToolsCustomAction;

let appReducer = (state: appState, action: appAction) =>
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
            ImageAction(AddSentence(sentence))
            ->ReductiveDevTools.Utilities.Serializer.serializeAction,
        },
        (),
      ),
    ~devToolsUpdateActionCreator=(_: appState) => DevToolsCustomAction,
    (),
  );

let store =
  (reductiveDevToolsEnhancer @@ Reductive.Store.create)(
    ~reducer=appReducer,
    ~preloadedState=initialAppState,
    ~enhancer=Middleware.logger,
    (),
  );

include ReductiveContext.Make({
  type action = appAction;
  type state = appState;
});