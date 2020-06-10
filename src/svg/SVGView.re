type rect = {
  width: float,
  height: float,
};

[@react.component]
let make = () => {
  let viewAreaRef = React.useRef(Js.Nullable.null);
  let (viewArea, setViewArea) =
    React.useState(() => {width: 0.0, height: 0.0});

  let calculateViewerSize = _ =>
    viewAreaRef.current
    ->Js.Nullable.toOption
    ->Tablecloth.Option.map(~f=Webapi.Dom.Element.getBoundingClientRect)
    ->Tablecloth.Option.map(~f=rect =>
        setViewArea(_ =>
          {
            width: rect->Webapi.Dom.DomRect.width,
            height: rect->Webapi.Dom.DomRect.height,
          }
        )
      )
    ->ignore;

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

  <div className="app__svg-view" ref={viewAreaRef->ReactDOMRe.Ref.domRef}>
    <SVG width={viewArea.width} height={viewArea.height} />
  </div>;
};