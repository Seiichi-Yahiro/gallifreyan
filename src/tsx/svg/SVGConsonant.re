open CommonTypes;

module SVGWordCutMask = {
  [@react.component]
  let make = (~id: uuid, ~letterId: uuid, ~x: float, ~y: float) => {
    let circleRSelector =
      React.useCallback1(
        (state: AppState.appState) =>
          state.image.circles
          ->Tablecloth.StrDict.get(~key=id)
          ->Tablecloth.Option.map(~f=circle => circle.r),
        [|id|],
      );

    let r: option(float) = AppState.useSelector(circleRSelector);

    switch (r) {
    | None => React.null
    | Some(r) =>
      <circle
        cx={Js.Float.toString(-. x)}
        cy={Js.Float.toString(-. y)}
        r={r->Js.Float.toString}
        fill="inherit"
        stroke="inherit"
        mask={j|url(#mask_$letterId)|j}
        style={ReactDOMRe.Style.make(~pointerEvents="none", ())}
      />
    };
  };
};

[@react.component]
let make =
    (
      ~id: uuid,
      ~parentId: option(uuid),
      ~posType: ImageTypes.consonantPosType,
      ~x: float,
      ~y: float,
      ~r: float,
      ~filled: bool,
    ) => {
  switch (posType, parentId) {
  | (DeepCut | ShallowCut, Some(parentId)) =>
    <>
      <mask id={j|mask_$id|j}>
        <circle r={r->Js.Float.toString} fill="#000000" stroke="#ffffff" />
      </mask>
      <SVGWordCutMask id=parentId letterId=id x y />
      <SVGCircle r filled fill="transparent" stroke="none" />
    </>
  | _ => <SVGCircle r filled />
  };
};