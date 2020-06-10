open CommonTypes;

let useIsHovered = (id: uuid): bool => {
  let isHoveredSelector =
    React.useCallback1(
      (state: AppState.appState) =>
        state.work.hovered
        ->Tablecloth.Option.map(~f=hoveredId => hoveredId === id)
        ->Tablecloth.Option.withDefault(~default=false),
      [|id|],
    );

  AppState.useSelector(isHoveredSelector);
};