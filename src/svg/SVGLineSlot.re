open CommonTypes;

[@react.component]
let make = (~id: uuid) => {
  let dispatch = AppState.useDispatch();
  let isSelected = Hooks.useIsSelected(id);
  let isHovered = Hooks.useIsHovered(id);

  let lineSlotSelector =
    React.useCallback1(
      (state: AppState.appState) =>
        state.image.lineSlots->Tablecloth.StrDict.get(~key=id),
      [|id|],
    );

  let lineSlot: option(ImageTypes.lineSlot) =
    AppState.useSelector(lineSlotSelector);

  switch (lineSlot) {
  | None => React.null
  | Some({pos}) =>
    let (x, y) = pos->TextTransforms.calculateTranslation;
    let length = Js.Math.sqrt(x *. x +. y *. y);
    let lineLength = 10.0;
    let xDir = lineLength *. x /. length;
    let yDir = lineLength *. y /. length;
    let x2 = x +. xDir;
    let y2 = y +. yDir;

    let (x1, y1) = (x, y)->Tablecloth.Tuple2.mapAll(~f=Js.Float.toString);
    let (x2, y2) = (x2, y2)->Tablecloth.Tuple2.mapAll(~f=Js.Float.toString);

    let onMouseEnter = _ => id->Some->Hover->WorkAction->dispatch;
    let onMouseLeave = _ => None->Hover->WorkAction->dispatch;
    let onClick = event => {
      id->Some->Select->WorkAction->dispatch;
      event->ReactEvent.Mouse.stopPropagation;
    };

    let color = SVGGroup.getColor(~isHovered, ~isSelected);

    <g fill=color stroke=color>
      <line x1 y1 x2 y2 strokeWidth="1" stroke="inherit" />
      <circle
        cx=x1
        cy=y1
        r="5"
        fill="transparent"
        stroke={isSelected || isHovered ? "inherit" : "none"}
        onMouseEnter
        onMouseLeave
        onClick
      />
    </g>;
  };
};