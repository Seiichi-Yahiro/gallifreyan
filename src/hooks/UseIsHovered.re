open CommonTypes;

let useIsHovered = (id: uuid): bool => {
  let isHoveredSelector =
    React.useCallback1(
      (state: Store.State.t) =>
        state.work.hovered
        ->Tablecloth.Option.map(~f=hoveredId => hoveredId === id)
        ->Tablecloth.Option.withDefault(~default=false),
      [|id|],
    );

  Store.useSelector(isHoveredSelector);
};