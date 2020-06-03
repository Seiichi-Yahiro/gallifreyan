open ImageState;

type appState = {image: imageState};

let initialAppState: appState = {image: initialImageState};

type appAction =
  | ImageAction(imageAction)
  | DevToolsCustomAction;

let appReducer = (state: appState, action: appAction) =>
  switch (action) {
  | ImageAction(imageAction) => {
      ...state,
      image: imageReducer(state.image, imageAction),
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