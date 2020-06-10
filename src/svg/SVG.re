let svgSizeSelector = (state: AppState.appState) => state.image.svgSize;
let textSelector = (state: AppState.appState) => state.image.text;

[@react.component]
let make = (~width: float, ~height: float) => {
  let size = AppState.useSelector(svgSizeSelector);
  let (viewBox, style) =
    React.useMemo1(
      () =>
        (
          {j|0 0 $size $size|j},
          {
            let halfSize = float_of_int(size) /. 2.0;
            ReactDOMRe.Style.make(
              ~transform={j|translate($(halfSize)px, $(halfSize)px)|j},
              ~stroke="#000000",
              ~fill="#000000",
              (),
            );
          },
        ),
      [|size|],
    );

  let text = AppState.useSelector(textSelector);
  let text' =
    text
    ->Tablecloth.List.map(~f=circleItem =>
        <SVGCircleItem key={circleItem.id} circleItem parentId="" />
      )
    ->Tablecloth.Array.fromList
    ->React.array;

  <SVGPanZoom
    width height detectAutoPan=false toolbarProps={position: "left"}>
    <svg viewBox> <g style> text' </g> </svg>
  </SVGPanZoom>;
};