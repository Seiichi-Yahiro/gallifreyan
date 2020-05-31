let svgSizeSelector = (state: AppState.appState) => state.image.svgSize;

type rect = {
  width: float,
  height: float,
};

[@react.component]
let make = () => {
  let viewBoxRef = React.useRef(Js.Nullable.null);
  let (viewBox, setViewBox) =
    React.useState(() => {width: 0.0, height: 0.0});

  let calculateViewerSize = _ =>
    viewBoxRef.current
    ->Js.Nullable.toOption
    ->Belt_Option.map(Webapi.Dom.Element.getBoundingClientRect)
    ->Belt_Option.forEach(rect =>
        setViewBox(_ =>
          {
            width: rect->Webapi.Dom.DomRect.width,
            height: rect->Webapi.Dom.DomRect.height,
          }
        )
      );

  React.useEffect0(() => {
    calculateViewerSize();
    None;
  });

  React.useEffect0(() => {
    Webapi.Dom.Window.addEventListener(
      "resize",
      calculateViewerSize,
      Webapi.Dom.window,
    );

    Some(
      () =>
        Webapi.Dom.Window.removeEventListener(
          "resize",
          calculateViewerSize,
          Webapi.Dom.window,
        )
        ->ignore,
    );
  });

  let size = AppState.useSelector(svgSizeSelector);
  let viewbox = {j|0 0 $size $size|j};

  <div className="app__svg-view" ref={viewBoxRef->ReactDOMRe.Ref.domRef}>
    <SVGPanZoom
      width={viewBox.width}
      height={viewBox.height}
      detectAutoPan=false
      toolbarProps={position: "left"}>
      <svg viewBox=viewbox />
    </SVGPanZoom>
  </div>;
};