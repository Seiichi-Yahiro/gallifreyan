type appAction =
  | AddSentence(string);

let appReducer = (state: StateTypes.appState, action) =>
  switch (action) {
  | AddSentence(sentence) => {
      ...state,
      circles:
        StateTypes.HashMap.add(
          sentence,
          {
            r: 1.0,
            filled: false,
            pos: {
              angle: 0.0,
              distance: 0.0,
            },
          }: StateTypes.circle,
          state.circles,
        ),
    }
  };

let appStore =
  Reductive.Store.create(
    ~reducer=appReducer,
    ~preloadedState={circles: StateTypes.HashMap.empty, sentences: [||]},
    ~enhancer=Middleware.logger,
    (),
  );

include ReductiveContext.Make({
  type action = appAction;
  type state = StateTypes.appState;
});