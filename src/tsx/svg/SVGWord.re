open CommonTypes;

module SVGConsonantCutMask = {
  [@react.component]
  let make = (~id: uuid) => {
    let circleSelector =
      React.useCallback1(
        (state: AppState.appState) =>
          state.image.circles->Tablecloth.StrDict.get(~key=id),
        [|id|],
      );

    let circle: option(ImageTypes.circle) =
      AppState.useSelector(circleSelector);

    switch (circle) {
    | None => React.null
    | Some({r, pos}) =>
      let (x, y) = pos->TextTransforms.calculateTranslation;
      <circle
        cx={x->Js.Float.toString}
        cy={y->Js.Float.toString}
        r={r->Js.Float.toString}
        fill="#000000"
        stroke="#000000"
      />;
    };
  };
};

[@react.component]
let make =
    (
      ~id: uuid,
      ~r: float,
      ~filled: bool,
      ~letters: list(ImageTypes.circleItem),
    ) => {
  let consonantCutMasks =
    letters
    ->Tablecloth.List.filter(~f=letter =>
        switch (letter.type_) {
        | Letter(Consonant(DeepCut | ShallowCut, _)) => true
        | _ => false
        }
      )
    ->Tablecloth.List.map(~f=letter =>
        <SVGConsonantCutMask key={letter.id} id={letter.id} />
      )
    ->Tablecloth.Array.fromList
    ->React.array;

  <>
    <mask id={j|mask_$id|j}>
      <circle r={r->Js.Float.toString} fill="#000000" stroke="#ffffff" />
      consonantCutMasks
    </mask>
    <SVGCircle id r filled mask={j|url(#mask_$id)|j} />
  </>;
};