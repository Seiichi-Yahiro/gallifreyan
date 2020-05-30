open ImageState;

type appState = {image: imageState};

let initialAppState: appState = {image: initialImageState};

type appAction =
  | ImageAction(imageAction);

let appReducer = (state: appState, action: appAction) =>
  switch (action) {
  | ImageAction(imageAction) => {
      ...state,
      image: imageReducer(state.image, imageAction),
    }
  };

let store =
  Reductive.Store.create(
    ~reducer=appReducer,
    ~preloadedState=initialAppState,
    ~enhancer=Middleware.logger,
    (),
  );

include ReductiveContext.Make({
  type action = appAction;
  type state = appState;
});