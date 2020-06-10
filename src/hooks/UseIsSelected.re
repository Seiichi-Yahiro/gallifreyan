open CommonTypes;

let useIsSelected = (id: uuid): bool => {
  let isSelectedSelector =
    React.useCallback1(
      (state: Store.State.t) =>
        state.work.selected
        ->Tablecloth.Option.map(~f=selectedId => selectedId === id)
        ->Tablecloth.Option.withDefault(~default=false),
      [|id|],
    );

  Store.useSelector(isSelectedSelector);
};