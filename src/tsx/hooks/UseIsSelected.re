open CommonTypes;

let useIsSelected = (id: uuid): bool => {
  let isSelectedSelector =
    React.useCallback1(
      (state: AppState.appState) =>
        state.work.selected
        ->Tablecloth.Option.map(~f=selectedId => selectedId === id)
        ->Tablecloth.Option.withDefault(~default=false),
      [|id|],
    );

  AppState.useSelector(isSelectedSelector);
};