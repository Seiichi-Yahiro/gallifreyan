let useCircle = (id: string): option(StateTypes.circle) => {
  let circleSelector =
    React.useCallback1(
      (state: StateTypes.appState) => StateTypes.findSafe(id, state.circles),
      [|id|],
    );
  AppStore.useSelector(circleSelector);
};

[@react.component]
let make = () => {
  let (count, setCount) = React.useState(() => 0);
  let dispatch = AppStore.useDispatch();
  let circle = useCircle("funsy0");

  let r =
    switch (circle) {
    | Some(circle) => circle.r
    | None => 999.0
    };

  <div
    className="app"
    onClick={_ => {
      setCount(count => count + 1);
      dispatch(AddSentence("funsy" ++ string_of_int(count)));
    }}>
    {React.string("test")}
    {React.float(r)}
  </div>;
};